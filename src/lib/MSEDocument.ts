// MSE types
// These will change if the JSON from the PEG.js grammar changes, but not automatically
// It helps with code completion in VSCode

export class MSEDocument {
    elementNamePrefix: string;
    nodes: Element[];

    // take raw JSON and transform it
    constructor()
    constructor(elementNamePrefix: string)
    constructor(elementNamePrefix?: string)
    {
        this.elementNamePrefix = elementNamePrefix || String.empty;
        this.nodes = new Array<Element>();
    }

    public fromJson(jsonNodes: any)
    {
        jsonNodes?.nodes.forEach(jsonElement => this.nodes.push(
            new Element(this.elementNamePrefix).fromJson(jsonElement)));
    }

    public addElement(elementNode: Element)
    {
        if(elementNode.elementNamePrefix == String.empty)
        {
            elementNode.elementNamePrefix = this.elementNamePrefix;
        }
        
        this.nodes.push(elementNode);
    }

    public static readonly OPEN_TOKEN = "(";
    public static readonly CLOSE_TOKEN = ")";
    public toMSE(): string {
        let result: string = MSEDocument.OPEN_TOKEN;
        this.nodes.forEach(node => result += '\n' + node.toMSE());
        result += MSEDocument.CLOSE_TOKEN;
        return result;
    }
}

export class Element {
    elementNamePrefix: string
    name: string
    id?: string
    attrs: Attr[]

    constructor(name: string)
    constructor(name: string, id: string)
    constructor(name: string, elementNamePrefix: string)
    constructor(name: string, id: string, elementNamePrefix: string)
    constructor(name:string, id?: string, elementNamePrefix?: string) {
        this.name = name;
        this.id = id || String.empty;
        this.elementNamePrefix = elementNamePrefix || String.empty;
        this.attrs = new Array<Attr>();
    }

    public fromJson(jsonElement: any)
    {
        jsonElement.attrs.forEach(attr => this.attrs.push(new Attr().fromJson(attr)));
        this.name = jsonElement.name;
        this.id = jsonElement.id;
        return this;
    }

    public addAttribute(attr: Attr)
    {
        this.attrs.push(attr);
    }

    public toMSE(): string {
        let result: string = '\t';
        result += MSEDocument.OPEN_TOKEN + this.elementNamePrefix + this.name + ' ';
        if (this.id) {
            result += MSEDocument.OPEN_TOKEN + 'id: ' + this.id + MSEDocument.CLOSE_TOKEN
        };
        this.attrs.forEach(attr => result += '\n' + attr.toMSE());
        result += MSEDocument.CLOSE_TOKEN;
        return result;
    };

    getFirstValueForAttr(attrToFind: string): string {
        let result: Array<Attr> = this.attrs.filter(attr => attr.name == attrToFind);
        const numberFound = result.length;

        if (numberFound == 1) return result[0].vals[0];
        return '';
    }
}

export class Attr {
    name: string;
    vals: any[];

    constructor() 
    constructor(name: string, vals: any[])
    constructor(name?: string, vals?: any[])
    {
        this.name = name || String.empty;
        this.vals = new Array<any>();

        if(vals!=null)
        {
            vals.forEach(val => this.vals.push(val));
        }
    }

    public fromJson(jsonAttr: any)
    {
        this.name = jsonAttr.name;
        jsonAttr.vals.forEach(val => this.vals.push(val));
        return this;
    }

    public toMSE(): string {
        let result: string = '\t\t' + MSEDocument.OPEN_TOKEN;
        result += this.name;
        result += this.valsToMSE();
        result += MSEDocument.CLOSE_TOKEN;
        return result;
    }

    valsToMSE(): string {
        let result: string = '';
        // parse the vals
        // here it's raw JSON
        let vals = this.vals;
        if (vals.length == 1) {
            if (typeof vals[0] === 'string') result+= ' ' + vals[0]; 
            else {
                const o = this.vals[0]; // object
                result += ' ' + MSEDocument.OPEN_TOKEN;
                for (let [key, value] of Object.entries(o)) {
                    result += key + ': ' + value;
                }
                result += MSEDocument.CLOSE_TOKEN;
            }
        } else if (vals.length > 1) {
            vals.forEach(val => result += ' ' + val);
        } else throw new Error("Unknown value type at Attr name: " + this.name + " with: " + this.vals.length + " values. " + JSON.stringify(this.vals));
            
        return result;
    }
}

declare const String: StringExtensions;
interface StringExtensions extends StringConstructor {
    empty: '';
}
String.empty = '';