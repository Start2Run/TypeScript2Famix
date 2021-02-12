/**
 * Represente une methode
 */
import { Parameter } from "./Parameter";

export class Method {
    name: string;
    type: string;
    scope: string;
    argument: Array<Parameter>;
    signature: string;

    constructor(name: string, type?: string, scope?: string, argument?: Array<Parameter>) {
        this.name = name;
        this.type = type;
        this.scope = scope;
        this.argument = argument
    }

    setargument(argument: Array<Parameter>): void {
        this.argument = argument;
    }

    getSignature(): string {
        return this.signature;
    }


    setSignature(signature: string): void {
        this.signature = signature;
    }
}