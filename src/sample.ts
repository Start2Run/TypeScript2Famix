import { Project } from "ts-morph";
const project = new Project();

import * as Famix from "./lib/model/famix";
import * as FamixFile from "./lib/model/file";
import {FamixBaseElement} from "./lib/famix_base_element";
import {FamixMseExporter} from "./lib/famix_mse_exporter";
import { FamixRepository } from './lib/famix_repository';

import * as fs from 'fs';
import { clearScreenDown } from "readline";

try
{
    const sourceFiles = project.addSourceFilesAtPaths("**/resources/*.ts");
    
    var fmxRep = new FamixRepository();

    //var fmxPackage = new Famix.Package(fmxRep);
    let namespaces = new Map<string,Famix.Namespace>();
    sourceFiles.forEach(file => {
        var fmxFileAnchor = new Famix.FileAnchor(fmxRep);
        fmxFileAnchor.setFileName(file.getBaseName())
        fmxFileAnchor.setStartLine(file.getStartLineNumber())
        fmxFileAnchor.setEndLine(file.getEndLineNumber())

        if (file.getNamespaces().length > 0) {
            var namespace = file.getNamespaces()[0];
            var name = namespace.getName();

            let fmxNamespace : Famix.Namespace;
            if (namespaces.has(name)) { 
                fmxNamespace = namespaces.get(name);
            }
            else
            {
                fmxNamespace = new Famix.Namespace(fmxRep);
                //fmxNamespace.setParentPackage(fmxPackage)    
                fmxNamespace.setName(name);
            }
            
            namespaces.set(name, fmxNamespace);
            namespace.getClasses().forEach(cls => {
                var fmxClass = new Famix.Class(fmxRep);
                var fileName = cls.getName();
                //fmxPackage.addChildNamedEntities(fmxClass);
                fmxClass.setName(fileName);
                fmxRep.addElement(fmxClass);
                //fmxClass.setParentPackage(fmxPackage);

                cls.getMethods().forEach(method => {
                    var fmxMethod=new Famix.Method(fmxRep);
                    fmxMethod.setName(method.getName())
                    fmxClass.addMethods(fmxMethod);
                });
            });
         }
    });
    var mse = fmxRep.getMSE();
    
    fs.writeFile('sample.mse',mse, (err) => { if (err) throw err; });
}
catch(Error)
{
    console.log(Error.message);
}
