import { Project } from "ts-morph";
const project = new Project();

import * as Famix from "./lib/model/famix";
import { FamixRepository } from './lib/famix_repository';
import './FmxClassExternsions'

import * as fs from 'fs';

if (process.argv.length != 3) {
    process.exit(-1);
}

var folderPath = process.argv[2];

try {
    const sourceFiles = project.addSourceFilesAtPaths(folderPath + "/*.ts");

    var fmxRep = new FamixRepository();

    let namespaces = new Map<string, Famix.Namespace>();
    sourceFiles.forEach(file => {
        var fmxFileAnchor = new Famix.IndexedFileAnchor(fmxRep);
        fmxFileAnchor.setFileName(file.getFilePath())
        fmxFileAnchor.setStartPos(file.getStartLineNumber())
        fmxFileAnchor.setEndPos(file.getEndLineNumber())

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
                var fmxClass = new Famix.Class(fmxRep).UpdateInfo(cls.getName(), fmxNamespace, fmxFileAnchor, false);
                fmxRep.addElement(fmxClass);
            });

            namespace.getInterfaces().forEach(interf => {
                var fmxClass = new Famix.Class(fmxRep).UpdateInfo(interf.getName(), fmxNamespace, fmxFileAnchor, true);
                fmxRep.addElement(fmxClass);
            });
        }
    });

    sourceFiles.forEach(file => {
        file.getNamespaces().forEach(namespace => {
            namespace.getClasses().forEach(cls => {
                var fmxClass = fmxRep.getFamixClass(cls.getName());
                fmxClass.AddMethods(cls.getMethods(), fmxRep);
                fmxClass.AddProperties(cls.getProperties(), fmxRep);
                fmxClass.AddDerivedClasses(cls.getDerivedClasses(), fmxRep);
            });

            namespace.getInterfaces().forEach(interf => {
                var fmxClass = fmxRep.getFamixClass(interf.getName());
                fmxClass.AddMethods(interf.getMethods(), fmxRep);
                fmxClass.AddProperties(interf.getProperties(), fmxRep);
                fmxClass.AddInterfaceImplementations(interf.getImplementations(), fmxRep)
            });
        })
    });

    var mse = fmxRep.getMSE();

    fs.writeFile('sample.mse', mse, (err) => { if (err) throw err; });
}
catch (Error) {
    console.log(Error.message);
}