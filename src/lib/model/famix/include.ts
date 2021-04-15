// automatically generated code, please do not change

import { FamixMseExporter } from '../../famix_mse_exporter';
import { Association } from './association';

export class Include extends Association {
  private includeSource: object;

  // @FameProperty(name = "source")
  public getSource(): object {
    return this.includeSource;
  }

  public setSource(includeSource: object) {
    this.includeSource = includeSource;
  }

  private includeTarget: object;

  // @FameProperty(name = "target")
  public getTarget(): object {
    return this.includeTarget;
  }

  public setTarget(includeTarget: object) {
    this.includeTarget = includeTarget;
  }

  public getMSE(): string {
    const mse: FamixMseExporter = new FamixMseExporter('FAMIX.Include', this);
    this.addPropertiesToExporter(mse);
    return mse.getMSE();
  }

  public addPropertiesToExporter(exporter: FamixMseExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty('source', this.getSource());
    exporter.addProperty('target', this.getTarget());
  }
}
