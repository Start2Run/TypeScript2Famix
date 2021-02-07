// automatically generated code, please do not change

import {FamixMseExporter} from "../../famix_mse_exporter";
import {Method} from "./method";
import {Exception} from "./exception";

export class DeclaredException extends Exception {

  private declaredExceptionDefiningMethod: Method;

  // oneMany.Getter
  // @FameProperty(name = "definingMethod", opposite = "declaredExceptions")
  public getDefiningMethod(): Method {
    return this.declaredExceptionDefiningMethod;
  }

  // oneMany.Setter
  public setDefiningMethod(newDefiningMethod: Method) {
    this.declaredExceptionDefiningMethod = newDefiningMethod;
    newDefiningMethod.getDeclaredExceptions().add(this);
  }


  public getMSE(): string {
    const mse: FamixMseExporter = new FamixMseExporter("FAMIX.DeclaredException", this);
    this.addPropertiesToExporter(mse);
    return mse.getMSE();
  }

  public addPropertiesToExporter(exporter: FamixMseExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty("definingMethod", this.getDefiningMethod());

  }

}

