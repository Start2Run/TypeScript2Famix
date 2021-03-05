import { Project } from "ts-morph";
const project = new Project();

import { FamixRepository } from './lib/famix_repository';
import './FmxClassExternsions'

import * as fs from 'fs';
import { Helper } from "./helper";

if (process.argv.length != 3) {
    process.exit(-1);
}

var folderPath = process.argv[2];

try {
    const sourceFiles = project.addSourceFilesAtPaths(folderPath + "/*.ts");

    var fmxRep = new FamixRepository();

    let helper = new Helper(fmxRep);

    sourceFiles.forEach(file => {
        var fmxFileAnchor = helper.loadFileAnchors(file);

        // Load classes and interfaces without namespace
        file.getClasses().forEach(cls => {
            helper.loadClass(cls, fmxFileAnchor);
        });
        file.getInterfaces().forEach(interf => {
            helper.loadInterface(interf, fmxFileAnchor);
        });

        file.getNamespaces().forEach(namespace => {
            var fmxNamespace = helper.loadNamespace(namespace);

            // Load classes and interfaces inside a namespace
            namespace.getClasses().forEach(cls => {
                helper.loadClass(cls, fmxFileAnchor, fmxNamespace);
            });
            namespace.getInterfaces().forEach(interf => {
                helper.loadInterface(interf, fmxFileAnchor, fmxNamespace);
            });
        });
    });
    helper.classes.forEach(cls => {
        var fmxClass = fmxRep.getFamixClass(cls.getName());
        fmxClass.AddMethods(cls.getMethods(), fmxRep);
        fmxClass.AddProperties(cls.getProperties(), fmxRep);
        fmxClass.AddDerivedClasses(cls.getDerivedClasses(), fmxRep);
    });

    helper.interfaces.forEach(interf => {
        var fmxClass = fmxRep.getFamixClass(interf.getName());
        fmxClass.AddMethods(interf.getMethods(), fmxRep);
        fmxClass.AddProperties(interf.getProperties(), fmxRep);
        fmxClass.AddInterfaceImplementations(interf.getImplementations(), fmxRep)
    });

    var mse = fmxRep.getMSE();

    fs.writeFile('sample.mse', mse, (err) => { if (err) throw err; });
}
catch (Error) {
    console.log(Error.message);
}