import { ClassDeclaration, ImplementationLocation, MethodDeclaration, MethodSignature, Project, PropertyDeclaration, PropertySignature, ts } from "ts-morph";
const project = new Project();

import * as Famix from "./lib/model/famix";
import { FamixRepository } from './lib/famix_repository';

import * as fs from 'fs';

try {
    const sourceFiles = project.addSourceFilesAtPaths("**/resources/*.ts");

    var fmxRep = new FamixRepository();

    let namespaces = new Map<string, Famix.Namespace>();
    sourceFiles.forEach(file => {
        var fmxFileAnchor = new Famix.FileAnchor(fmxRep);
        fmxFileAnchor.setFileName(file.getBaseName())
        fmxFileAnchor.setStartLine(file.getStartLineNumber())
        fmxFileAnchor.setEndLine(file.getEndLineNumber())

        if (file.getNamespaces().length > 0) {
            var namespace = file.getNamespaces()[0];
            var name = namespace.getName();

            let fmxNamespace: Famix.Namespace;
            if (namespaces.has(name)) {
                fmxNamespace = namespaces.get(name);
            }
            else {
                fmxNamespace = new Famix.Namespace(fmxRep);
                fmxNamespace.setName(name);
            }
            namespaces.set(name, fmxNamespace);
            namespace.getClasses().forEach(cls => {
                createFamixClass(cls.getName(), fmxNamespace, fmxFileAnchor, false);
            });

            namespace.getInterfaces().forEach(interf => {
                createFamixClass(interf.getName(), fmxNamespace, fmxFileAnchor, false);
            });
        }
    });

    sourceFiles.forEach(file => {
        file.getNamespaces().forEach(namespace => {
            namespace.getClasses().forEach(cls => {
                var fmxClass = fmxRep.getFamixClass(cls.getName());
                addClassMethods(cls.getMethods(), fmxClass);
                addClassProperties(cls.getProperties(), fmxClass);
                addDerivedClasses(cls.getDerivedClasses(), fmxClass);
            });

            namespace.getInterfaces().forEach(interf => {
                var fmxClass = fmxRep.getFamixClass(interf.getName());
                addInterfaceMethods(interf.getMethods(), fmxClass);
                addInterfaceProperties(interf.getProperties(), fmxClass);
                addInterfaceImplementations(interf.getImplementations(),fmxClass)
            });
        })
    });

    var mse = fmxRep.getMSE();

    fs.writeFile('sample.mse', mse, (err) => { if (err) throw err; });
}
catch (Error) {
    console.log(Error.message);
}

function createFamixClass(name: string, fmxNamespace: Famix.Namespace, fmxFileAnchor: Famix.FileAnchor, isInterface: boolean) {
    var fmxClass = new Famix.Class(fmxRep);
    var fileName = name;
    fmxClass.setName(fileName);
    fmxClass.setIsInterface(isInterface);
    fmxRep.addElement(fmxClass);
    fmxClass.setContainer(fmxNamespace);
    fmxFileAnchor.setElement(fmxClass);
}

function addClassMethods(methods: MethodDeclaration[], fmxClass: Famix.Class) {
    methods.forEach(method => {
        var fmxMethod = new Famix.Method(fmxRep);
        fmxMethod.setName(method.getName())
        fmxMethod.setParentType(fmxClass);
        fmxMethod.setNumberOfLinesOfCode(method.getEndLineNumber() - method.getStartLineNumber());
    });
}

function addInterfaceMethods(methods: MethodSignature[], fmxClass: Famix.Class) {
    methods.forEach(method => {
        var fmxMethod = new Famix.Method(fmxRep);
        fmxMethod.setName(method.getName())
        fmxMethod.setParentType(fmxClass);
    });
}

function addClassProperties(props: PropertyDeclaration[], fmxClass: Famix.Class) {
    props.forEach(prop => {
        var fmxAttribute = new Famix.Attribute(fmxRep);
        fmxAttribute.setName(prop.getName());
        fmxAttribute.setParentType(fmxClass);
    });
}

function addInterfaceProperties(props: PropertySignature[], fmxClass: Famix.Class) {
    props.forEach(prop => {
        var fmxAttribute = new Famix.Attribute(fmxRep);
        fmxAttribute.setName(prop.getName());
        fmxAttribute.setParentType(fmxClass);
    });
}

function addDerivedClasses(derivedClasses: ClassDeclaration[], fmxClass: Famix.Class) {
    derivedClasses.forEach(derivedClass => {
        var fmxInheritance = new Famix.Inheritance(fmxRep);
        var subclass = fmxRep.getFamixClass(derivedClass.getName());
        fmxInheritance.setSubclass(subclass);
        fmxInheritance.setSuperclass(fmxClass);
    });
}

function addInterfaceImplementations(implementations: ImplementationLocation[], fmxClass: Famix.Class) {
    implementations.forEach(implementation => {
        var fmxInheritance = new Famix.Inheritance(fmxRep);
        var subclass = fmxRep.getFamixClass(implementation.getNode().getText());
        fmxInheritance.setSubclass(subclass);
        fmxInheritance.setSuperclass(fmxClass);
    });
}
