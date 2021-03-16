import { FamixRepository } from './lib/famix_repository';
import { ClassDeclaration, FunctionDeclaration, InterfaceDeclaration, NamespaceDeclaration, VariableDeclaration, MethodDeclaration } from 'ts-morph';
import * as Famix from "./lib/model/famix";

import { mseClassHelper } from './mseClassHelper';
import { mseMethodHelper } from './mseMethodHelper';
import { msePropertyHelper } from './msePropertyHelper';
import { Globals } from './Globals';
import { Function } from './lib/model/famix/function';
import { mseFileAnchorHelper } from './mseFileAnchorHelper';

export class mseBuilder {
    private _repository: FamixRepository;
    private _namespaces = new Map<string, Famix.Namespace>();
    private _classes: ClassDeclaration[] = [];
    private _interfaces: InterfaceDeclaration[] = [];
    private _fmxGlobalNamespace: Famix.Namespace;
    private _fmxGlobalClass: Famix.Class;

    private _fmxClassHelper: mseClassHelper;
    private _fmxMethodHelper: mseMethodHelper;
    private _fmxPropertyHelper: msePropertyHelper;

    constructor() {
        this._repository = new FamixRepository()

        this._fmxGlobalNamespace = new Famix.Namespace(this._repository)
        this._fmxGlobalNamespace.setName(Globals.GlobalNameSpace)

        this._fmxGlobalClass = new Famix.Class(this._repository)
        this._fmxGlobalClass.setName(Globals.GlobcalClass)

        this._fmxClassHelper = new mseClassHelper(this._repository)
        this._fmxMethodHelper = new mseMethodHelper(this._repository, this._fmxGlobalNamespace)
        this._fmxPropertyHelper = new msePropertyHelper(this._repository, this._fmxGlobalNamespace)
    }

    public loadNamespace(namespaceDeclaration: NamespaceDeclaration): Famix.Namespace {
        var name = namespaceDeclaration.getName();
        let fmxNamespace: Famix.Namespace;
        if (this._namespaces.has(name)) {
            fmxNamespace = this._namespaces.get(name)
        }
        else {
            fmxNamespace = new Famix.Namespace(this._repository)
            fmxNamespace.setName(name)
        }
        this._namespaces.set(name, fmxNamespace)
        return fmxNamespace;
    }

    public addClass(classDeclaration: ClassDeclaration, sourceFileName: string, fmxNameSpace: Famix.Namespace = null) {
        var name = classDeclaration.getName();
        this._fmxClassHelper.loadClass(classDeclaration, sourceFileName, fmxNameSpace)
        this._classes.push(classDeclaration)
        fmxNameSpace.addTypes(this.getFamixClass(name))
    }

    public addInterface(interfaceDeclaration: InterfaceDeclaration, sourceFileName: string, fmxNameSpace: Famix.Namespace = null) {
        var name = interfaceDeclaration.getName();
        this._fmxClassHelper.loadInterface(interfaceDeclaration, sourceFileName, fmxNameSpace)
        this._interfaces.push(interfaceDeclaration)
        fmxNameSpace.addTypes(this.getFamixClass(name))
    }

    public addMethods(name: string, classDeclaration: any) {
        var fmxClass = this.getFamixClass(name)
        if (!fmxClass.getIsInterface()) {
            this._fmxMethodHelper.addConstructors(classDeclaration.getConstructors(), fmxClass)
        }
        this._fmxMethodHelper.addMethods(classDeclaration.getMethods(), fmxClass)
    }

    public addMethodReferences(method:MethodDeclaration, className:string) {
        if (method.findReferences != undefined) {
            var fmxClass = this.getFamixClass(className)
            var fmxMethod = this.getFamixMethod(method.getName(), fmxClass)
            if (fmxMethod != null) {
                this._fmxMethodHelper.addReferences(method, fmxMethod, fmxClass)
            }
          }
    }

    public addProperties(name: string, classDeclaration: any) {
        var fmxClass = this.getFamixClass(name)
        this._fmxPropertyHelper.addProperties(classDeclaration.getProperties(), fmxClass)
    };

    public addInterfaceImplementations(name: string, implementations: any[]) {
        implementations.forEach((implementation) => {
            var fmxInheritance = new Famix.Inheritance(this._repository);
            var fmxSuperClass = this.getFamixClass(name);
            var fmxSubclass = this.getFamixClass(implementation.getNode().getText());
            fmxInheritance.setSubclass(fmxSubclass);
            fmxInheritance.setSuperclass(fmxSuperClass);
        });
    };

    public addDerivedClasses(name: string, derivedClasses: ClassDeclaration[]) {
        var fmxClass = this.getFamixClass(name);
        derivedClasses.forEach((derivedClass) => {
            var fmxInheritance = new Famix.Inheritance(this._repository);
            var subclass = this.getFamixClass(derivedClass.getName());
            fmxInheritance.setSubclass(subclass);
            fmxInheritance.setSuperclass(fmxClass);
        });
    }

    public addFunctions(functions: FunctionDeclaration[], fileName: string) {
        functions.forEach((func) => {
            var fmxFunction = new Famix.Function(this._repository)
            fmxFunction.setName(func.getName())
            var fmxFileSourceAnchor = mseFileAnchorHelper.createFileAnchor(this._repository, fileName, func.getStart(), func.getEnd())
            fmxFunction.setSourceAnchor(fmxFileSourceAnchor)
            fmxFunction.setContainer(this._fmxGlobalNamespace)
        });
    }

    public addVariables(variables: VariableDeclaration[], fileName: string)
    {
        variables.forEach((variable) => {
            var fmxVariable = new Famix.GlobalVariable(this._repository)
            fmxVariable.setName(variable.getName())
            var fmxFileSourceAnchor = mseFileAnchorHelper.createFileAnchor(this._repository, fileName, variable.getStart(), variable.getEnd())
            fmxVariable.setSourceAnchor(fmxFileSourceAnchor)
        });
    }

    public getClassDeclarations(): ClassDeclaration[] {
        return this._classes
    }

    public getInterfaceDeclarations(): InterfaceDeclaration[] {
        return this._interfaces
    }

    private getFamixClass(className: string): Famix.Class {
        return this._repository.getFamixClass(className);
    }

    private getFamixMethod(methodName: string, fmxClass: Famix.Class):Famix.Method {
        let fmxMethod :Famix.Method
        fmxClass.getMethods().forEach(m => {
          if (m.getName() == methodName) {
              fmxMethod = m;
              return;
          }
        })
        return fmxMethod;
    }


    public getMSE(): string {
        return this._repository.getMSE()
    }
}