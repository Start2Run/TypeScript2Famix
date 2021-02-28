import { Project } from 'ts-morph';
const project = new Project();

import * as Famix from './lib/model/famix';
import { FamixRepository } from './lib/famix_repository';
import './FmxClassExternsions';
import * as fileSystem from 'fs';
import * as gTools from './generatorTools';
if (process.argv.length != 3) {
  console.log('Source folder was not provided');
  process.exit(-1);
}

var folderPath = process.argv[2];

try {
  const sourceFiles = project.addSourceFilesAtPaths(folderPath + '/*.ts');

  var fmxRep = new FamixRepository();
  fmxRep.createOrGetFamixPackage(gTools.BASE_PACKAGE);

  let namespaces = new Map<string, Famix.Namespace>();

  sourceFiles.forEach((file) => {
    var fileAnchor = gTools.FileAnchor.add(fmxRep, file);

    file.getNamespaces().forEach((namespace) => {
      var fmxNamespace = gTools.Namespace.add(fmxRep, namespace, namespaces);

      namespace.getClasses().forEach((cls) => {
        gTools.TsClass.add(fmxRep, cls, fmxNamespace, fileAnchor);
      });

      namespace.getInterfaces().forEach((interf) => {
        gTools.TsInterface.add(fmxRep, interf, fmxNamespace, fileAnchor);
      });
    });
  });

  sourceFiles.forEach((file) => {
    file.getNamespaces().forEach((namespace) => {
      namespace.getClasses().forEach((cls) => {
        var fmxClass = fmxRep.getFamixClass(cls.getName());
        gTools.TsClass.addMethods(fmxRep, fmxClass, cls);
        gTools.TsClass.addProperties(fmxRep, fmxClass, cls);
        gTools.TsClass.AddDerivedClasses(fmxRep, fmxClass, cls);
      });

      namespace.getInterfaces().forEach((interf) => {
        var fmxClass = fmxRep.getFamixClass(interf.getName());
        gTools.TsInterface.addMethods(fmxRep, fmxClass, interf);
        gTools.TsInterface.addProperties(fmxRep, fmxClass, interf);
        gTools.TsInterface.AddImplementations(fmxRep, fmxClass, interf);
      });
    });
  });

  var mse = fmxRep.getMSE();

  fileSystem.writeFile('generatedSample.mse', mse, (err) => {
    if (err) throw err;
  });
} catch (Error) {
  console.log(Error.message);
}
