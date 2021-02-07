// automatically generated code, please do not change

import {FamixMseExporter} from "../../famix_mse_exporter";
import {Entity} from "./entity";
import {Class} from "./class";

export class Exception extends Entity {

  private exceptionExceptionClass: Class;

  // @FameProperty(name = "exceptionClass")
  public getExceptionClass(): Class {
    return this.exceptionExceptionClass;
  }

  public setExceptionClass(exceptionExceptionClass: Class) {
    this.exceptionExceptionClass = exceptionExceptionClass;
  }


  public getMSE(): string {
    const mse: FamixMseExporter = new FamixMseExporter("FAMIX.Exception", this);
    this.addPropertiesToExporter(mse);
    return mse.getMSE();
  }

  public addPropertiesToExporter(exporter: FamixMseExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("exceptionClass", this.getExceptionClass());

  }

}

