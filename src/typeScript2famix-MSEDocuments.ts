import * as MSEDocument from "./lib/MSEDocument";
import * as fs from "fs";
import { Project } from "ts-morph";

const elementNamePrefix = "Famix-TypeScript-Entities.";
const classType = "Class";
const methodType = "Method";

const project = new Project();

class MseBuilder
{
    public elements : Map<number, MSEDocument.Element>
    private _iterator : number;
    private mseDoc = new MSEDocument.MSEDocument(elementNamePrefix);
    
    constructor()
    {
        this.elements = new Map<number, MSEDocument.Element>();
        this._iterator = 1;
    }

    public addClass() : MseClass
    {
        var id = this.getNextId();      
        var element = new MseClass(classType, id);
        element.Id;
        this.elements.set(id, element);
        this.mseDoc.addElement(element);
        return element;
    }

    public addMethod() : MseMethod
    {
        var id = this.getNextId();      
        var element = new MseMethod(methodType, id);
        this.elements.set(id, element);
        this.mseDoc.addElement(element);
        return element;
    }
  
    public getMse():string
    {
        return this.mseDoc.toMSE();
    }

    private getNextId() : number
    {
        return this._iterator++
    }
}

export class MseClass extends MSEDocument.Element
{
    private _id:number;
   
    constructor(name:string, id:number)
    {
        super(name,id.toString());
        this._id=id;
    }

    get Id(): number 
    {
        return this._id;
    }

    public setName( name : string)
    {
        this.addAttribute(new MSEDocument.Attr("name", [this.getAttributeValueAsFormatedString(name)]));
    }

    public setModifiers(modifier : string)
    {
        this.addAttribute(new MSEDocument.Attr("modifiers", [this.getAttributeValueAsFormatedString(modifier)]));
    }

    public setRef( refId : number)
    {
        this.addAttribute(new MSEDocument.Attr("typeContainer", [{"ref": refId}]));
    }

    private getAttributeValueAsFormatedString(attributeValue : string) : string
    {
        return "'" + attributeValue + "'";
    }
}

export class MseMethod extends MSEDocument.Element
{
    private _id:number;
   
    constructor(name:string, id:number)
    {
        super(name,id.toString());
        this._id=id;
    }

    get Id(): number 
    {
        return this._id;
    }

    public setName(name : string)
    {
        this.addAttribute(new MSEDocument.Attr("name", [this.getAttributeValueAsFormatedString(name)]));
    }

    public setCyclomaticComplexity(cyclomaticComplexity : number)
    {
        this.addAttribute(new MSEDocument.Attr("cyclomaticComplexity", [cyclomaticComplexity]));
    }

    public setDeclaredType(declaredType : number)
    {
        this.addAttribute(new MSEDocument.Attr("declaredType",  [{"ref": declaredType}]));
    }

    public setModifiers(modifier : string)
    {
        this.addAttribute(new MSEDocument.Attr("modifiers", [this.getAttributeValueAsFormatedString(modifier)]));
    }

    public setNumberOfStatements(numberOfStatements : number)
    {
        this.addAttribute(new MSEDocument.Attr("numberOfStatements", [numberOfStatements]));
    }

    public setParentType(parentType : number)
    {
        this.addAttribute(new MSEDocument.Attr("parentType", [{"ref": parentType}]));
    }

    public setSignature(signature : string)
    {
        this.addAttribute(new MSEDocument.Attr("signature", [this.getAttributeValueAsFormatedString(signature)]));
    }
 
    private getAttributeValueAsFormatedString(attributeValue : string) : string
    {
        return "'" + attributeValue + "'";
    }
}

var builder = new MseBuilder();

try
{
    const sourceFiles = project.addSourceFilesAtPaths("**/resources/*.ts");
    sourceFiles.forEach(file => {
        if (file.getNamespaces().length > 0) {
            var namespace = file.getNamespaces()[0];
            var name = namespace.getName();
            namespace.getClasses().forEach(cls => {
                var classElement = builder.addClass();
                classElement.setName(cls.getName());
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
    
    fs.writeFile('sample.mse',mse, (err) => { if (err) throw err; });
}
catch(Error)
{
    console.log(Error.message);
}