import { FamixRepository } from './lib/famix_repository';
import { MethodDeclaration, Node, ParameterDeclaration, SyntaxKind } from 'ts-morph';
import * as Famix from './lib/model/famix';
import { MseFileAnchorHelper } from './mseFileAnchorHelper';
import { Globals } from './Globals';

/* tslint:disable-next-line */
const cyclomatic = require('./cyclomatic');

export class MseMethodHelper {
  private _repository: FamixRepository;
  private _fmxGlobalNamespace: Famix.Namespace;

  constructor(repository: FamixRepository, globalNamespace: Famix.Namespace) {
    this._repository = repository;
    this._fmxGlobalNamespace = globalNamespace;
  }

  public addMethods(methodDeclarations: MethodDeclaration[], fmxClass: Famix.Class) {
    const fileName = (fmxClass.getSourceAnchor() as Famix.IndexedFileAnchor).getFileName();
    const cc = cyclomatic.calculate(fileName);
    methodDeclarations.forEach((method) => {
      this.addMethod(method, fmxClass, cc, fileName, false);
    });
  }

  private getFamixClass(className: string): Famix.Class {
    return this._repository.getFamixClass(className);
  }

  public addConstructors(methodDeclarations: MethodDeclaration[], fmxClass: Famix.Class) {
    const fileName = (fmxClass.getSourceAnchor() as Famix.IndexedFileAnchor).getFileName();
    const cc = cyclomatic.calculate(fileName);
    methodDeclarations.forEach((method) => {
      this.addMethod(method, fmxClass, cc, fileName, true);
    });
  }

  private addMethod(
    method: MethodDeclaration,
    fmxClass: Famix.Class,
    cc: any,
    fileName: string,
    isConstructor: boolean,
  ) {
    const fmxMethod = new Famix.Method(this._repository);

    if (isConstructor) {
      fmxMethod.setName(Globals.ConstructorType);
    } else {
      fmxMethod.setName(method.getName());
    }

    fmxMethod.setKind(method.getKindName());
    fmxMethod.setParentType(fmxClass);
    fmxMethod.setNumberOfLinesOfCode(method.getEndLineNumber() - method.getStartLineNumber());
    if (!isConstructor) {
      if (cc[method.getName()] == null) {
        fmxMethod.setCyclomaticComplexity(1);
      } else {
        fmxMethod.setCyclomaticComplexity(cc[method.getName()]);
      }
      this.setSignature(method, fmxMethod);
    } else {
      fmxMethod.setCyclomaticComplexity(1);
    }

    const indexedFileAnchor = MseFileAnchorHelper.createFileAnchor(
      this._repository,
      fileName,
      method.getStart(),
      method.getEnd(),
    );
    indexedFileAnchor.setElement(fmxMethod);

    if (!fmxClass.getIsInterface()) {
      try {
        fmxMethod.addModifiers(method.getScope());
      } catch (Error) {
      //  console.log(Error.message);
      }
      fmxMethod.setNumberOfStatements(method.getStatements().length);
    }
    this.addParameters(method, fmxMethod);
    const typeName = method.getReturnType()?.getSymbol()?.getEscapedName() ?? Globals.VoidType;
    const fmxType = this.getFamixType(typeName);
    fmxMethod.setDeclaredType(fmxType);
  }

  public addReferences(node: any, fmxMethod: Famix.Method, fmxClass: Famix.Class) {
    node.findReferencesAsNodes().forEach((x) => this.addFamixInvocation(x, null, fmxMethod, fmxClass));
  }

  private addFamixInvocation(
    node: any,
    referencingMethodName: string,
    referencedMethod: Famix.Method,
    fmxClass: Famix.Class,
  ): boolean {
    const nodes = Array.from(node.getAncestors());
    for (const n of nodes) {
      const y = n as any;
      if (y.getKind() === SyntaxKind.Constructor || y.getKind() === SyntaxKind.MethodDeclaration) {
        referencingMethodName = this.getMethodNodeName(y);
      }
      if (y.getKind() === SyntaxKind.ClassDeclaration) {
        const invocationClass = this.getFamixClass(y.getName());
        const fmxMethods = invocationClass.getMethods();
        let referencingMethod: Famix.Method;
        fmxMethods.forEach((m) => {
          if (m.getName() === referencingMethodName) {
            referencingMethod = m;
          }
        });
        if (referencingMethod !== undefined) {
          const newInvocation = new Famix.Invocation(this._repository);
          newInvocation.addCandidates(referencedMethod);
          newInvocation.addCandidates(referencingMethod);
          newInvocation.setSender(referencingMethod);
          newInvocation.setReceiver(referencedMethod);
          referencedMethod.addIncomingInvocations(newInvocation);
          return true;
        }
      } else {
        if (this.addFamixInvocation(y, referencingMethodName, referencedMethod, fmxClass)) {
          return true;
        }
      }
    }
  }

  private getMethodNodeName(node: any): string {
    if (node.getKind() === SyntaxKind.Constructor) {
      return Globals.ConstructorType;
    } else if (node.getKind() === SyntaxKind.MethodDeclaration) {
      return node.getName();
    }
  }

  private setSignature(method: MethodDeclaration, fmxMethod: Famix.Method) {
    const signature =
      method.getName() +
      '(' +
      method
        .getParameters()
        .map((parameter) => parameter.getText())
        .toString() +
      ')';

    fmxMethod.setSignature(signature);
  }

  private addParameters = function (method: MethodDeclaration, fmxMethod: Famix.Method) {
    method.getParameters().forEach((param) => {
      this.addParameter(param, fmxMethod);
    });
  };

  private addParameter(parameter: ParameterDeclaration, fmxMethod: Famix.Method) {
    const fmxParameter = new Famix.Parameter(this._repository);
    fmxParameter.setName(parameter.getName());
    fmxParameter.setParentBehaviouralEntity(fmxMethod);
    const fmxFileAnchor = MseFileAnchorHelper.createFileAnchor(
      this._repository,
      (fmxMethod.getSourceAnchor() as Famix.IndexedFileAnchor).getFileName(),
      parameter.getStart(),
      parameter.getEnd(),
    );
    fmxFileAnchor.setElement(fmxParameter);
    const typeName = parameter.getType()?.getSymbol()?.getEscapedName() ?? Globals.VoidType;
    const fmxType = this.getFamixType(typeName);
    fmxParameter.setDeclaredType(fmxType);
  }

  private getFamixType(name: string): Famix.Type {
    let fmxClass = this._repository.getFamixClass(name);
    if (fmxClass != null) {
      return fmxClass;
    }
    fmxClass = new Famix.Class(this._repository);
    fmxClass.setName(name);
    fmxClass.setContainer(this._fmxGlobalNamespace);

    if (fmxClass != null) {
      this._fmxGlobalNamespace.addTypes(fmxClass);
    }
    return fmxClass;
  }
}
