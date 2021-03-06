import { Project } from 'ts-morph';
const project = new Project();

import { MseBuilder } from './MseBuilder';

import * as fs from 'fs';

if (process.argv.length !== 3) {
  process.exit(-1);
}

const folderPath = process.argv[2];

try {
  const sourceFiles = project.addSourceFilesAtPaths(folderPath + '/**/*.ts');

  const builder = new MseBuilder();

  sourceFiles.forEach((file) => {
    builder.addFunctions(file.getFunctions(), file.getFilePath());
    builder.addVariables(file.getVariableDeclarations(), file.getFilePath());
  });

  sourceFiles.forEach((file) => {
    // Load classes and interfaces without namespace
    const filePath = file.getFilePath();
    file.getClasses().forEach((cls) => {
      builder.addClass(cls, filePath);
    });
    file.getInterfaces().forEach((interf) => {
      builder.addInterface(interf, file.getFilePath());
    });

    file.getNamespaces().forEach((namespace) => {
      const fmxNamespace = builder.loadNamespace(namespace);

      // Load classes and interfaces inside a namespace
      namespace.getClasses().forEach((cls) => {
        builder.addClass(cls, filePath, fmxNamespace);
      });
      namespace.getInterfaces().forEach((interf) => {
        builder.addInterface(interf, filePath, fmxNamespace);
      });

      builder.addFunctions(namespace.getFunctions(), file.getFilePath());
      builder.addVariables(namespace.getVariableDeclarations(), file.getFilePath());
    });
  });

  builder.getClassDeclarations().forEach((cls) => {
    builder.addMethods(cls.getName(), cls);
    builder.addProperties(cls.getName(), cls);
    builder.addDerivedClasses(cls.getName(), cls.getDerivedClasses());
  });

  builder.getInterfaceDeclarations().forEach((interf) => {
    builder.addMethods(interf.getName(), interf);
    builder.addProperties(interf.getName(), interf);
    builder.addInterfaceImplementations(interf.getName(), interf.getImplementations());
  });

  builder.getClassDeclarations().forEach((cls) => {
    cls.getMethods().forEach((meth) => {
      builder.addMethodReferences(meth, cls.getName());
    });
  });

  const mse = builder.getMSE();

  fs.writeFile('sample.mse', mse, (err) => {
    if (err) throw err;
  });
} catch (Error) {
 /* tslint:disable-next-line */
  console.log(Error.message);
}
