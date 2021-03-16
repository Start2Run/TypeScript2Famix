import { Project } from "ts-morph";
const project = new Project();

import './FmxClassExternsions'
import { mseBuilder } from  './mseBuilder'

import * as fs from 'fs';

if (process.argv.length != 3) {
    process.exit(-1);
}

var folderPath = process.argv[2];

try {
    const sourceFiles = project.addSourceFilesAtPaths(folderPath + "/**/*.ts");

    var builder = new mseBuilder();

    sourceFiles.forEach(file => {
        builder.addFunctions(file.getFunctions(), file.getFilePath())
        var v= file.getVariableDeclarations()
    });

    sourceFiles.forEach(file => {
        // Load classes and interfaces without namespace
        var filePath = file.getFilePath();
        file.getClasses().forEach(cls => {
            builder.addClass(cls, filePath);
        });
        file.getInterfaces().forEach(interf => {
            builder.addInterface(interf, file.getFilePath());
        });

        file.getNamespaces().forEach(namespace => {
            var fmxNamespace = builder.loadNamespace(namespace);

            // Load classes and interfaces inside a namespace
            namespace.getClasses().forEach(cls => {
                builder.addClass(cls, filePath, fmxNamespace);
            });
            namespace.getInterfaces().forEach(interf => {
                builder.addInterface(interf, filePath, fmxNamespace);
            });
        });
    });
    builder.getClassDeclarations().forEach(cls => {
        builder.addMethods(cls.getName(),cls)
        builder.addProperties(cls.getName(),cls);
        builder.addDerivedClasses(cls.getName(), cls.getDerivedClasses());
    });

    builder.getInterfaceDeclarations().forEach(interf => {
        builder.addMethods(interf.getName(), interf)
        builder.addProperties(interf.getName(), interf);
        builder.addInterfaceImplementations(interf.getName(), interf.getImplementations())
    });

    var mse = builder.getMSE();

    fs.writeFile('sample.mse', mse, (err) => { if (err) throw err; });
}
catch (Error) {
    console.log(Error.message);
}