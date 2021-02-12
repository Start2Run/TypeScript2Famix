import * as Famix from "./lib/model/famix";
import { FamixRepository } from './lib/famix_repository';
import { Class } from "./lib/model/famix/class";
import { ClassDeclaration, ImplementationLocation, MethodDeclaration } from "ts-morph";

declare module './lib/model/famix/class' {
    interface Class {
        UpdateInfo(name: string, fmxNamespace: Famix.Namespace, fmxFileAnchor: Famix.FileAnchor, isInterface: boolean): Class;
        AddMethods(methods: any[], famixRepository: FamixRepository);
        AddDerivedClasses(derivedClasses: ClassDeclaration[], famixRepository: FamixRepository);
        AddProperties(props: any[], famixRepository: FamixRepository);
        AddInterfaceImplementations(implementations: ImplementationLocation[], famixRepository: FamixRepository);
    }
}

Class.prototype.UpdateInfo = function (name: string, fmxNamespace: Famix.Namespace, fmxFileAnchor: Famix.FileAnchor, isInterface: boolean) {
    this.setName(name);
    this.setIsInterface(isInterface);
    this.setContainer(fmxNamespace);
    fmxFileAnchor.setElement(this);
    return this;
}

Class.prototype.AddMethods = function (methods: MethodDeclaration[], famixRepository: FamixRepository) {
    methods.forEach(method => {
        var fmxMethod = new Famix.Method(famixRepository);
        fmxMethod.setName(method.getName())
        fmxMethod.setParentType(this);
        fmxMethod.setNumberOfLinesOfCode(method.getEndLineNumber() - method.getStartLineNumber());
    });
}

Class.prototype.AddDerivedClasses = function (derivedClasses: ClassDeclaration[], famixRepository: FamixRepository) {
    derivedClasses.forEach(derivedClass => {
        var fmxInheritance = new Famix.Inheritance(famixRepository);
        var subclass = famixRepository.getFamixClass(derivedClass.getName());
        fmxInheritance.setSubclass(subclass);
        fmxInheritance.setSuperclass(this);
    });
}

Class.prototype.AddProperties = function (props: any[], famixRepository: FamixRepository) {
    props.forEach(prop => {
        var fmxAttribute = new Famix.Attribute(famixRepository);
        fmxAttribute.setName(prop.getName());
        fmxAttribute.setParentType(this);
    });
}

Class.prototype.AddInterfaceImplementations = function (implementations: ImplementationLocation[], famixRepository: FamixRepository) {
    implementations.forEach(implementation => {
        var fmxInheritance = new Famix.Inheritance(famixRepository);
        var subclass = famixRepository.getFamixClass(implementation.getNode().getText());
        fmxInheritance.setSubclass(subclass);
        fmxInheritance.setSuperclass(this);
    });
}
