// automatically generated code, please do not change

import {FamixMseExporter} from "../../famix_mse_exporter";
import {SourceAnchor} from "./source_anchor";

export class PharoAnchor extends SourceAnchor {


  public getMSE(): string {
    const mse: FamixMseExporter = new FamixMseExporter("FAMIX.PharoAnchor", this);
    this.addPropertiesToExporter(mse);
    return mse.getMSE();
  }

  public addPropertiesToExporter(exporter: FamixMseExporter) {
    super.addPropertiesToExporter(exporter);

  }

}

