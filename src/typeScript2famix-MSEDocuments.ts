import * as fs from "fs";
import { Project } from "ts-morph";
import { MseBuilder } from "./MseBuilder";

const project = new Project();

var builder = new MseBuilder();

try {
    const sourceFiles = project.addSourceFilesAtPaths("**/resources/*.ts");
    sourceFiles.forEach(file => {
        if (file.getNamespaces().length > 0) {
            var namespace = file.getNamespaces()[0];
            //var name = namespace.getName();
            namespace.getInterfaces().forEach(interf => {
                var classElement = builder.addClass();
                classElement.setName(interf.getName());
                classElement.setClassIsInterface(true);
            });
            namespace.getClasses().forEach(cls => {
                var classElement = builder.addClass();
                classElement.setName(cls.getName());
                classElement.setClassIsInterface(false);
                cls.getMethods().forEach(method => {
                    var methodName = method.getName();
                    var methodElement = builder.addMethod();
                    methodElement.setName(methodName);
                    methodElement.setParentType(classElement.Id);
                });
            });
        }
    });

    var mse = builder.getMse();

    fs.writeFile('sample.mse', mse, (err) => { if (err) throw err; });
}
catch (Error) {
    console.log(Error.message);
}