/**
 * Cette classe permet de donner la structure d'une classe concrete
 */
import { ClassDeclaration, ClassElement, HeritageClause, Project, SourceFile, Type, TypeFlags } from "ts-morph";
import * as _ from "lodash";
import { Link } from "./Link";
import { EXTENDS, IMPLEMENTS, CLASS, INTERFACE } from "./Keyword";
import { link } from "fs";
import { Parameter } from "./Parameter";
import { Method } from "./Method";
import { SIGABRT } from "constants";

export class NodeClass {
    protected classDeclaration: ClassDeclaration;

    constructor(classDeclaration: ClassDeclaration) {
        this.classDeclaration = classDeclaration;
    }

    // Permet de determiner si une autre classe a un lien (heritage ou implementation) 
    // d'une autre classe
    hasLink(): boolean {
        return !_.isEmpty(this.getHeritageClauses());

    }

    // Retourne un array de parent si ils existent
    getHeritageClauses(): HeritageClause[] {
        return this.classDeclaration.getHeritageClauses();
    }

    getLinkElements(): Array<Link> {
        let linkElement = Array<Link>();
        if (this.hasLink()) {
            this.getHeritageClauses().forEach(element => {
                let text = element.getText();

                element.getTypeNodes().forEach(item => {
                    if (text.includes(EXTENDS)) {
                        linkElement.push(new Link(EXTENDS, CLASS, item.getText()))
                    } else if (text.includes(IMPLEMENTS)) {
                        linkElement.push(new Link(IMPLEMENTS, INTERFACE, item.getText()))
                    }
                });
            });
        }

        return linkElement;
    }

    getMethods(): Array<Method> {
        let elements = new Array<Method>();
        let methods = this.classDeclaration.getMethods();
        methods.forEach(element => {
            let name = element.getName();
            let scope = element.getScope();
            let returnType = element.getStructure().returnType + "";
            let argumentList = new Array<Parameter>();
            let definition = element.getSignature().getDeclaration().getText();
            let premierOccurence = definition.indexOf('{');

            let signature = definition.substring(0, premierOccurence);

            element.getStructure().parameters.forEach(element => {
                let parameterName = element.name;
                let parameterType = element.type + "";
                let parameterScope = element.scope + "";
                argumentList.push(new Parameter(parameterName, parameterType, parameterScope));
            });
            let method = new Method(name, returnType, scope, argumentList);
            method.setSignature(signature);
            method.getSignature();
            elements.push(method);
        });
        return elements;
    }

}