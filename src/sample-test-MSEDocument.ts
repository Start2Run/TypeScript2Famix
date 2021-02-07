import * as MseBuilder from "./lib/MSEDocument";
import * as fs from "fs";

const elementNamePrefix = "Famix-TypeScript-Entities.";
const classType = "Class";
const methodType = "Method";

var builder = new MseBuilder.MSEDocument(elementNamePrefix);

var mseClass = new MseBuilder.Element(classType, "5");
builder.addElement(mseClass);

mseClass.addAttribute(new MseBuilder.Attr("name", ["'A'"]));
mseClass.addAttribute(new MseBuilder.Attr("modifiers", ["'public'"]))
mseClass.addAttribute(new MseBuilder.Attr("typeContainer", [{"ref": "23"}]));

var mseMethod1 = new MseBuilder.Element(methodType, "12");
builder.addElement(mseMethod1);

mseMethod1.addAttribute(new MseBuilder.Attr("name", ["'getName'"]));
mseMethod1.addAttribute(new MseBuilder.Attr("cyclomaticComplexity", ["1"]))
mseMethod1.addAttribute(new MseBuilder.Attr("declaredType",[{"ref": "32"}]));
mseMethod1.addAttribute(new MseBuilder.Attr("modifiers", ["'public'"]));
mseMethod1.addAttribute(new MseBuilder.Attr("numberOfStatements", ["1"]));
mseMethod1.addAttribute(new MseBuilder.Attr("parentType", [{"ref": "5"}]));
mseMethod1.addAttribute(new MseBuilder.Attr("signature", ["'getName()'"]));


var mseMethod2 = new MseBuilder.Element(methodType, "16");
builder.addElement(mseMethod2);

mseMethod2.addAttribute(new MseBuilder.Attr("name", ["'setName'"]));
mseMethod2.addAttribute(new MseBuilder.Attr("cyclomaticComplexity", ["1"]))
mseMethod2.addAttribute(new MseBuilder.Attr("declaredType", [{"ref": "13"}]));
mseMethod2.addAttribute(new MseBuilder.Attr("modifiers", ["'public'"]));
mseMethod2.addAttribute(new MseBuilder.Attr("numberOfStatements", ["2"]));
mseMethod2.addAttribute(new MseBuilder.Attr("parentType", [{"ref": "5"}]));
mseMethod2.addAttribute(new MseBuilder.Attr("signature", ["'setName(String)'"]));

var mse = builder.toMSE();
fs.writeFile("sample.mse",mse, (err) => { if (err) throw err; });
console.log(mse);
