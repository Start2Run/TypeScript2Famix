import * as MSEDocument from "../lib/MSEDocument";

const classType = "Class";

export class MseClass extends MSEDocument.Element {
  private _id: number;

  constructor(id: number) {
      super(classType, id.toString());
      this._id = id;
  }

  get Id(): number {
      return this._id;
  }

  public setName(name: string) {
      this.addAttribute(new MSEDocument.Attr("name", [this.getAttributeValueAsFormatedString(name)]));
  }

  public setModifiers(modifier: string) {
      this.addAttribute(new MSEDocument.Attr("modifiers", [this.getAttributeValueAsFormatedString(modifier)]));
  }

  public setRef(refId: number) {
      this.addAttribute(new MSEDocument.Attr("typeContainer", [{ "ref": refId }]));
  }

  public setClassIsInterface(classIsInterface: boolean)
  {
      this.addAttribute(new MSEDocument.Attr("classIsInterface", [classIsInterface.toString()]));
  }

  private getAttributeValueAsFormatedString(attributeValue: string): string {
      return "'" + attributeValue + "'";
  }
}
