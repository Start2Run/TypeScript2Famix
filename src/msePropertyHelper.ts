import { FamixRepository } from './lib/famix_repository';
import { PropertyDeclaration, ClassDeclaration } from "ts-morph";
import * as Famix from "./lib/model/famix";

export class msePropertyHelper {

    private _repository: FamixRepository;
    private _fmxGlobalNamespace: Famix.Namespace;

    constructor(repository: FamixRepository, globalNamespace: Famix.Namespace) {
        this._repository = repository;
        this._fmxGlobalNamespace = globalNamespace
    }

    public addProperties = function (properties: PropertyDeclaration[], fmxClass: Famix.Class) {
        properties.forEach((prop) => {
            var fmxAttribute = new Famix.Attribute(this._repository);
            fmxAttribute.setName(prop.getName());
            fmxAttribute.setParentType(fmxClass);
            fmxAttribute.addModifiers(prop.getScope());
            var fmxType = this.getFamixType(prop.getType().getText())
            fmxAttribute.setDeclaredType(fmxType)
        });
    };

    private getFamixType(name: string): Famix.Type {
        var fmxClass = this._repository.getFamixClass(name)
        if (fmxClass != null) {
            return fmxClass;
        }
        fmxClass = new Famix.Class(this._repository)
        fmxClass.setName(name)
        fmxClass.setContainer(this._fmxGlobalNamespace)
        this._fmxGlobalNamespace.addTypes(fmxClass)
        return fmxClass;
    }
}