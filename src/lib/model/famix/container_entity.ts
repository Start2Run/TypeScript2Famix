// automatically generated code, please do not change

import { FamixMseExporter } from '../../famix_mse_exporter';
import { Function } from './function';
import { NamedEntity } from './named_entity';
import { Type } from './type';
import { AnnotationType } from './annotation_type';

export class ContainerEntity extends NamedEntity {
  private containerEntityTypes: Set<Type> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "types", opposite = "container", derived = true)
  public getTypes(): Set<Type> {
    return this.containerEntityTypes;
  }

  // manyOne.Setter
  public addTypes(containerEntityTypes: Type) {
    if (!this.containerEntityTypes.has(containerEntityTypes)) {
      this.containerEntityTypes.add(containerEntityTypes);
      containerEntityTypes.setContainer(this);
    }
  }

  /* tslint:disable-next-line */
  private containerEntityFunctions: Set<Function> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "functions", opposite = "container", derived = true)
  /* tslint:disable-next-line */
  public getFunctions(): Set<Function> {
    return this.containerEntityFunctions;
  }

  // manyOne.Setter
  /* tslint:disable-next-line */
  public addFunctions(containerEntityFunctions: Function) {
    if (!this.containerEntityFunctions.has(containerEntityFunctions)) {
      this.containerEntityFunctions.add(containerEntityFunctions);
      containerEntityFunctions.setContainer(this);
    }
  }

  private containerEntityDefinedAnnotationTypes: Set<AnnotationType> = new Set();

  // manyOne.Getter
  // @FameProperty(name = "definedAnnotationTypes", opposite = "container", derived = true)
  public getDefinedAnnotationTypes(): Set<AnnotationType> {
    return this.containerEntityDefinedAnnotationTypes;
  }

  // manyOne.Setter
  public addDefinedAnnotationTypes(containerEntityDefinedAnnotationTypes: AnnotationType) {
    if (!this.containerEntityDefinedAnnotationTypes.has(containerEntityDefinedAnnotationTypes)) {
      this.containerEntityDefinedAnnotationTypes.add(containerEntityDefinedAnnotationTypes);
      containerEntityDefinedAnnotationTypes.setContainer(this);
    }
  }

  public getMSE(): string {
    const mse: FamixMseExporter = new FamixMseExporter('FAMIX.ContainerEntity', this);
    this.addPropertiesToExporter(mse);
    return mse.getMSE();
  }

  public addPropertiesToExporter(exporter: FamixMseExporter) {
    super.addPropertiesToExporter(exporter);
    exporter.addProperty('types', this.getTypes());
    exporter.addProperty('functions', this.getFunctions());
    exporter.addProperty('definedAnnotationTypes', this.getDefinedAnnotationTypes());
  }
}
