import { FamixRepository } from '../lib/famix_repository';
import { Type } from '../lib/model/famix';
import { PropertyDeclaration } from 'ts-morph';
import { BASE_PACKAGE } from './index';

export class TsType {
  public static add(name: string, famixRepo: FamixRepository): Type {
    let xType: Type;
    xType = famixRepo.getFamixClass(name);

    if (xType == undefined) {
      xType = new Type(famixRepo);
      xType.setName(name);
      var basePackage = famixRepo.createOrGetFamixPackage(BASE_PACKAGE);
      xType.setParentPackage(basePackage);
    }
    return xType;
  }
}
