import { FamixRepository } from './lib/famix_repository';
import { PropertyDeclaration, ClassDeclaration } from "ts-morph";
import * as Famix from "./lib/model/famix";

export class msePropertyHelper {

    private _repository: FamixRepository;

    constructor(repository: FamixRepository) {
        this._repository = repository;
    }

    public addProperties = function (properties: PropertyDeclaration[], fmxClass: Famix.Class) {
        properties.forEach((prop) => {
            var fmxAttribute = new Famix.Attribute(this._repository);
            fmxAttribute.setName(prop.getName());
            fmxAttribute.setParentType(fmxClass);
            fmxAttribute.addModifiers(prop.getScope());
        });
    };

}