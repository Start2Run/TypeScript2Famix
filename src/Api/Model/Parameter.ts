/**
 * Cette classe permet de representer un parametre 
 */
export class Parameter {
    name: string;
    type: string;
    scope: string;

    constructor(name: string, type ?: string, scope ? : string) {
        this.name = name;
        this.type = type;
        this.scope = scope;
    }
}