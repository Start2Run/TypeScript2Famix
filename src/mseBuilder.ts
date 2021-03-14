import { FamixRepository } from './lib/famix_repository';
import { ClassDeclaration, InterfaceDeclaration, NamespaceDeclaration } from "ts-morph";
import * as Famix from "./lib/model/famix";

import { mseClassHelper } from './mseClassHelper';
import { mseMethodHelper } from './mseMethodHelper';
import { msePropertyHelper } from './msePropertyHelper';


export class mseBuilder {
    private _repository: FamixRepository;
    private _namespaces = new Map<string, Famix.Namespace>();
    private _classes: ClassDeclaration[] = [];
    private _interfaces: InterfaceDeclaration[] = [];
    private 

    private _fmxClassHelper: mseClassHelper;
    private _fmxMethodHelper: mseMethodHelper;
    private _fmxPropertyHelper: msePropertyHelper;

    constructor() {
        this._repository = new FamixRepository()
        this._fmxClassHelper = new mseClassHelper(this._repository)
        this._fmxMethodHelper = new mseMethodHelper(this._repository)
        this._fmxPropertyHelper = new msePropertyHelper(this._repository)
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
        this._fmxClassHelper.loadClass(classDeclaration, sourceFileName, fmxNameSpace)
        this._classes.push(classDeclaration)
    }

    public addInterface(interfaceDeclaration: InterfaceDeclaration, sourceFileName: string, fmxNameSpace: Famix.Namespace = null) {
        this._fmxClassHelper.loadInterface(interfaceDeclaration, sourceFileName, fmxNameSpace)
        this._interfaces.push(interfaceDeclaration)
    }

    public addMethods(name: string, classDeclaration: any) {
        var fmxClass = this.getFamixClass(name)
        this._fmxMethodHelper.addMethods(classDeclaration.getMethods(), fmxClass)
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
    };

    public getClassDeclarations(): ClassDeclaration[] {
        return this._classes
    }

    public getInterfaceDeclarations(): InterfaceDeclaration[] {
        return this._interfaces
    }

    public addType()
    {}

    private getFamixClass(className: string): Famix.Class {
        return this._repository.getFamixClass(className);
    }

    public getMSE(): string {
        return this._repository.getMSE()
    }
}