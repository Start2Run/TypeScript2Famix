import * as MSEDocument from "./lib/MSEDocument";

const methodType = "Method";

export class MseMethod extends MSEDocument.Element {
  private _id: number;

  constructor(id: number) {
      super(methodType, id.toString());
      this._id = id;
  }

  get Id(): number {
      return this._id;
  }

  public setName(name: string) {
      this.addAttribute(new MSEDocument.Attr("name", [this.getAttributeValueAsFormatedString(name)]));
  }

  public setCyclomaticComplexity(cyclomaticComplexity: number) {
      this.addAttribute(new MSEDocument.Attr("cyclomaticComplexity", [cyclomaticComplexity]));
  }

  public setDeclaredType(declaredType: number) {
      this.addAttribute(new MSEDocument.Attr("declaredType", [{ "ref": declaredType }]));
  }

  public setModifiers(modifier: string) {
      this.addAttribute(new MSEDocument.Attr("modifiers", [this.getAttributeValueAsFormatedString(modifier)]));
  }

  public setNumberOfStatements(numberOfStatements: number) {
      this.addAttribute(new MSEDocument.Attr("numberOfStatements", [numberOfStatements]));
  }

  public setParentType(parentType: number) {
      this.addAttribute(new MSEDocument.Attr("parentType", [{ "ref": parentType }]));
  }

  public setSignature(signature: string) {
      this.addAttribute(new MSEDocument.Attr("signature", [this.getAttributeValueAsFormatedString(signature)]));
  }

  private getAttributeValueAsFormatedString(attributeValue: string): string {
      return "'" + attributeValue + "'";
  }
}