import { FamixRepository } from './lib/famix_repository';
import {
  ClassDeclaration,
  FunctionDeclaration,
  InterfaceDeclaration,
  NamespaceDeclaration,
  VariableDeclaration,
  MethodDeclaration,
} from 'ts-morph';
import * as Famix from './lib/model/famix';

import { MseClassHelper } from './mseClassHelper';
import { MseMethodHelper } from './mseMethodHelper';
import { MsePropertyHelper } from './msePropertyHelper';
import { Globals } from './Globals';
import { MseFileAnchorHelper } from './mseFileAnchorHelper';

export class MseBuilder {
  private _repository: FamixRepository;
  private _namespaces = new Map<string, Famix.Namespace>();
  private _classes: ClassDeclaration[] = [];
  private _interfaces: InterfaceDeclaration[] = [];
  private _fmxGlobalNamespace: Famix.Namespace;
  private _fmxGlobalClass: Famix.Class;

  private _fmxClassHelper: MseClassHelper;
  private _fmxMethodHelper: MseMethodHelper;
  private _fmxPropertyHelper: MsePropertyHelper;

  constructor() {
    this._repository = new FamixRepository();

    this._fmxGlobalNamespace = new Famix.Namespace(this._repository);
    this._fmxGlobalNamespace.setName(Globals.GlobalNameSpace);

    this._fmxGlobalClass = new Famix.Class(this._repository);
    this._fmxGlobalClass.setName(Globals.GlobcalClass);

    this._fmxClassHelper = new MseClassHelper(this._repository);
    this._fmxMethodHelper = new MseMethodHelper(this._repository, this._fmxGlobalNamespace);
    this._fmxPropertyHelper = new MsePropertyHelper(this._repository, this._fmxGlobalNamespace);
  }

  public loadNamespace(namespaceDeclaration: NamespaceDeclaration): Famix.Namespace {
    const name = namespaceDeclaration.getName();
    let fmxNamespace: Famix.Namespace;
    if (this._namespaces.has(name)) {
      fmxNamespace = this._namespaces.get(name);
    } else {
      fmxNamespace = new Famix.Namespace(this._repository);
      fmxNamespace.setName(name);
    }
    this._namespaces.set(name, fmxNamespace);
    return fmxNamespace;
  }

  public addClass(classDeclaration: ClassDeclaration, sourceFileName: string, fmxNameSpace: Famix.Namespace = null) {
    const name = classDeclaration.getName();
    this._fmxClassHelper.loadClass(classDeclaration, sourceFileName, fmxNameSpace);
    this._classes.push(classDeclaration);
    if (fmxNameSpace == null) {
      this._fmxGlobalNamespace.addTypes(this.getFamixClass(name));
    } else {
      fmxNameSpace.addTypes(this.getFamixClass(name));
    }
  }

  public addInterface(
    interfaceDeclaration: InterfaceDeclaration,
    sourceFileName: string,
    fmxNameSpace: Famix.Namespace = null,
  ) {
    const name = interfaceDeclaration.getName();
    this._fmxClassHelper.loadInterface(interfaceDeclaration, sourceFileName, fmxNameSpace);
    this._interfaces.push(interfaceDeclaration);
    if (fmxNameSpace == null) {
      this._fmxGlobalNamespace.addTypes(this.getFamixClass(name));
    } else {
      fmxNameSpace.addTypes(this.getFamixClass(name));
    }
  }

  public addMethods(name: string, classDeclaration: any) {
    const fmxClass = this.getFamixClass(name);
    if (!fmxClass.getIsInterface()) {
      this._fmxMethodHelper.addConstructors(classDeclaration.getConstructors(), fmxClass);
    }
    this._fmxMethodHelper.addMethods(classDeclaration.getMethods(), fmxClass);
  }

  public addMethodReferences(method: MethodDeclaration, className: string) {
    if (method.findReferences !== undefined) {
      const fmxClass = this.getFamixClass(className);
      const fmxMethod = this.getFamixMethod(method.getName(), fmxClass);
      if (fmxMethod != null) {
        this._fmxMethodHelper.addReferences(method, fmxMethod, fmxClass);
      }
    }
  }

  public addProperties(name: string, classDeclaration: any) {
    const fmxClass = this.getFamixClass(name);
    this._fmxPropertyHelper.addProperties(classDeclaration.getProperties(), fmxClass);
  }

  public addInterfaceImplementations(name: string, implementations: any[]) {
    implementations.forEach((implementation) => {
      const fmxSuperClass = this.getFamixClass(name);
      const fmxSubclass = this.getFamixClass(implementation.getNode().getText());
      if (fmxSubclass == null || fmxSuperClass == null) {
        // console.log('Error in addInterfaceImplementations: ' + name + '-' + implementation.getNode().getText());
        return;
      }
      const fmxInheritance = new Famix.Inheritance(this._repository);
      fmxInheritance.setSubclass(fmxSubclass);
      fmxInheritance.setSuperclass(fmxSuperClass);
    });
  }

  public addDerivedClasses(name: string, derivedClasses: ClassDeclaration[]) {
    const fmxClass = this.getFamixClass(name);
    derivedClasses.forEach((derivedClass) => {
      const fmxInheritance = new Famix.Inheritance(this._repository);
      const subclass = this.getFamixClass(derivedClass.getName());
      fmxInheritance.setSubclass(subclass);
      fmxInheritance.setSuperclass(fmxClass);
    });
  }

  public addFunctions(functions: FunctionDeclaration[], fileName: string) {
    functions.forEach((func) => {
      const fmxFunction = new Famix.Function(this._repository);
      fmxFunction.setName(func.getName());
      const fmxFileSourceAnchor = MseFileAnchorHelper.createFileAnchor(
        this._repository,
        fileName,
        func.getStart(),
        func.getEnd(),
      );
      fmxFunction.setSourceAnchor(fmxFileSourceAnchor);
      fmxFunction.setContainer(this._fmxGlobalNamespace);
    });
  }

  public addVariables(variables: VariableDeclaration[], fileName: string) {
    variables.forEach((variable) => {
      const fmxVariable = new Famix.GlobalVariable(this._repository);
      fmxVariable.setName(variable.getName());
      const fmxFileSourceAnchor = MseFileAnchorHelper.createFileAnchor(
        this._repository,
        fileName,
        variable.getStart(),
        variable.getEnd(),
      );
      fmxVariable.setSourceAnchor(fmxFileSourceAnchor);
    });
  }

  public getClassDeclarations(): ClassDeclaration[] {
    return this._classes;
  }

  public getInterfaceDeclarations(): InterfaceDeclaration[] {
    return this._interfaces;
  }

  private getFamixClass(className: string): Famix.Class {
    return this._repository.getFamixClass(className);
  }

  private getFamixMethod(methodName: string, fmxClass: Famix.Class): Famix.Method {
    let fmxMethod: Famix.Method;
    fmxClass.getMethods().forEach((m) => {
      if (m.getName() === methodName) {
        fmxMethod = m;
        return;
      }
    });
    return fmxMethod;
  }

  public getMSE(): string {
    return this._repository.getMSE();
  }
}
