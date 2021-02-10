import { Project } from "ts-morph";
const project = new Project();

import * as Famix from "./lib/model/famix";
import * as FamixFile from "./lib/model/file";
import { FamixBaseElement } from "./lib/famix_base_element";
import { FamixMseExporter } from "./lib/famix_mse_exporter";
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
                var fmxClass = new Famix.Class(fmxRep);
                var fileName = cls.getName();
                fmxClass.setName(fileName);
                fmxRep.addElement(fmxClass);
                fmxClass.setContainer(fmxNamespace);
                fmxFileAnchor.setElement(fmxClass);
            });
            namespace.getClasses().forEach(cls => {
                var fmxClass = fmxRep.getFamixClass(cls.getName());
                var hasMethods = cls.getMethods().length > 0;
                var hasDecorators = cls.getDecorators().length > 0;
                var hasAncestors = cls.getAncestors().length > 0;
                var hasProperties = cls.getProperties().length > 0;
                if (hasMethods) {
                    cls.getMethods().forEach(method => {
                        var fmxMethod = new Famix.Method(fmxRep);
                        fmxMethod.setName(method.getName())
                        fmxMethod.setParentType(fmxClass);
                        fmxMethod.setNumberOfLinesOfCode(method.getEndLineNumber() - method.getStartLineNumber());
                    });
                }
                if (hasDecorators) {
                    cls.getDecorators().forEach(decorator => {
                        var fmxAttribute = new Famix.Attribute(fmxRep);
                        fmxAttribute.setName(decorator.getName());
                        fmxAttribute.setParentType(fmxClass);
                    });
                }
                if (hasProperties) {
                    cls.getProperties().forEach(prop => {
                        var fmxAttribute = new Famix.Attribute(fmxRep);
                        fmxAttribute.setName(prop.getName());
                        fmxAttribute.setParentType(fmxClass);
                    });
                }

                if (hasAncestors) {
                    // cls.getAncestors().forEach(ancestor => {
                    //     var fmxInheritance = new Famix.Inheritance(fmxRep);
                    //     fmxInheritance.setSubclass(fmxClass);
                    //     var superclass = fmxRep.getFamixClass(ancestor.getKindName());
                    //     fmxInheritance.setSuperclass(superclass);
                    // });
                }
            });
        }
    });
    var mse = fmxRep.getMSE();

    fs.writeFile('sample.mse', mse, (err) => { if (err) throw err; });
}
catch (Error) {
    console.log(Error.message);
}
