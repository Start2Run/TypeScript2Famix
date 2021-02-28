import { FamixRepository } from '../lib/famix_repository';
import { Class as FamixClass, Attribute } from '../lib/model/famix';
import { PropertyDeclaration } from 'ts-morph';
import { TsType } from './ts-type';

export class TsProperty {
  public static add(
    fmxClass: FamixClass,
    famixRepo: FamixRepository,
    property: PropertyDeclaration
  ) {
    var fmxAttribute = new Attribute(famixRepo);
    fmxAttribute.setName(property.getName());
    fmxAttribute.setParentType(fmxClass);

    fmxAttribute.setDeclaredType(
      TsType.add(property.getType().getText(), famixRepo)
    );

    this.addModifier(fmxAttribute, property);
  }

  private static addModifier(
    fmxAttribute: Attribute,
    property: PropertyDeclaration
  ) {
    var propModifier = property
      .getModifiers()
      .map((modifier) => modifier.getText())
      .toString();
    if (propModifier.length > 0) fmxAttribute.addModifiers(propModifier);
  }
}
