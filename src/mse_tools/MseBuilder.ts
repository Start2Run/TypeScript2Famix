import * as MSEDocument from "../lib/MSEDocument";
import { MseClass } from "./MseClass";
import { MseMethod } from "./MseMethod";

const elementNamePrefix = "Famix-TypeScript-Entities.";

export class MseBuilder {
  public elements: Map<number, MSEDocument.Element>
  private _iterator: number;
  private mseDoc = new MSEDocument.MSEDocument(elementNamePrefix);

  constructor() {
      this.elements = new Map<number, MSEDocument.Element>();
      this._iterator = 1;
  }

  public addClass(): MseClass {
      var id = this.getNextId();
      var element = new MseClass(id);
      this.addElement(element, id);
      return element;
  }

  public addMethod(): MseMethod {
      var id = this.getNextId();
      var element = new MseMethod(id);
      this.addElement(element, id);
      return element;
  }

  private addElement(element: MSEDocument.Element, id: number) {
      this.elements.set(id, element);
      this.mseDoc.addElement(element);
  }

  public getMse(): string {
      return this.mseDoc.toMSE();
  }

  private getNextId(): number {
      return this._iterator++
  }
}