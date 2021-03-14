import { FamixRepository } from './lib/famix_repository';
import { MethodDeclaration, ParameterDeclaration } from "ts-morph";
import * as Famix from "./lib/model/famix";
import { mseFileAnchorHelper } from './mseFileAnchorHelper';
import { Globals } from './Globals';

const cyclomatic = require('./cyclomatic');

export class mseMethodHelper {
  private _repository: FamixRepository;
  private _fmxGlobalNamespace: Famix.Namespace;

  constructor(repository: FamixRepository, globalNamespace: Famix.Namespace) {
    this._repository = repository;
    this._fmxGlobalNamespace = globalNamespace
  }

  public addMethods(methodDeclarations: MethodDeclaration[], fmxClass: Famix.Class) {
    var fileName = (fmxClass.getSourceAnchor() as Famix.IndexedFileAnchor).getFileName()
    var cc = cyclomatic.calculate(fileName);
    methodDeclarations.forEach(method => {
      this.addMethod(method, fmxClass, cc, fileName, false)
    });
  }

  public addConstructors(methodDeclarations: MethodDeclaration[], fmxClass: Famix.Class) {
    var fileName = (fmxClass.getSourceAnchor() as Famix.IndexedFileAnchor).getFileName()
    var cc = cyclomatic.calculate(fileName);
    methodDeclarations.forEach(method => {
      this.addMethod(method, fmxClass, cc, fileName, true)
    });
  }

  private addMethod(method: MethodDeclaration, fmxClass: Famix.Class, cc: any, fileName: string, isConstructor: boolean) {
    var fmxMethod = new Famix.Method(this._repository)
    if (isConstructor) {
      fmxMethod.setName(Globals.ConstructorType)
    }
    else {
      fmxMethod.setName(method.getName())
    }

    fmxMethod.setKind(method.getKindName())
    fmxMethod.setParentType(fmxClass)
    fmxMethod.setNumberOfLinesOfCode(method.getEndLineNumber() - method.getStartLineNumber());
    if (!isConstructor) {
      fmxMethod.setCyclomaticComplexity(cc[method.getName()])
      this.setSignature(method, fmxMethod)
    }

    var indexedFileAnchor = mseFileAnchorHelper.createFileAnchor(this._repository, fileName, method.getStart(), method.getEnd())
    indexedFileAnchor.setElement(fmxMethod)

    if (!fmxClass.getIsInterface()) {
      fmxMethod.addModifiers(method.getScope())
      fmxMethod.setNumberOfStatements(method.getStatements().length)
    }
    this.addParameters(method, fmxMethod)
    var typeName = method.getReturnType()?.getSymbol()?.getEscapedName() ?? Globals.VoidType
    var fmxType = this.getFamixType(typeName)
    fmxMethod.setDeclaredType(fmxType)
  }

  private setSignature(method: MethodDeclaration, fmxMethod: Famix.Method) {
    let signature = method.getName()
      + "("
      + method
        .getParameters()
        .map((parameter) => parameter.getText())
        .toString()
      + ")";

    fmxMethod.setSignature(signature)
  }

  private addParameters = function (method: MethodDeclaration, fmxMethod: Famix.Method) {
    method.getParameters().forEach(param => {
      this.addParameter(param, fmxMethod)
    });
  }

  private addParameter(parameter: ParameterDeclaration, fmxMethod: Famix.Method) {
    var fmxParameter = new Famix.Parameter(this._repository)
    fmxParameter.setName(parameter.getName())
    fmxParameter.setParentBehaviouralEntity(fmxMethod)
    var fmxFileAnchor = mseFileAnchorHelper.createFileAnchor(this._repository, (fmxMethod.getSourceAnchor() as Famix.IndexedFileAnchor).getFileName(), parameter.getStart(), parameter.getEnd())
    fmxFileAnchor.setElement(fmxParameter)
    var typeName =parameter.getType()?.getSymbol()?.getEscapedName() ?? Globals.VoidType
    var fmxType = this.getFamixType(typeName)
    fmxParameter.setDeclaredType(fmxType)
  }

  private getFamixType(name: string): Famix.Type {
    var fmxClass = this._repository.getFamixClass(name)
    if (fmxClass != null) {
      return fmxClass;
    }
    fmxClass = new Famix.Class(this._repository)
    fmxClass.setName(name)
    fmxClass.setContainer(this._fmxGlobalNamespace)
    this._fmxGlobalNamespace.addTypes(fmxClass)
    return fmxClass;
  }
}