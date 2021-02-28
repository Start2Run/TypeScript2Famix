import { FamixRepository } from '../lib/famix_repository';
import * as Famix from '../lib/model/famix';
import { ClassDeclaration } from 'ts-morph';

export class TsClass {
  public static add(
    famixRepo: FamixRepository,
    tsClass: ClassDeclaration,
    namespace: Famix.Namespace,
    fileAnchor: Famix.IndexedFileAnchor
  ) {
    var fmxClass = new Famix.Class(famixRepo).UpdateInfo(
      tsClass.getName(),
      namespace,
      fileAnchor,
      false
    );
    famixRepo.addElement(fmxClass);
  }

  public static addMethods(
    famixRepo: FamixRepository,
    fmxClass: Famix.Class,
    tsClass: ClassDeclaration
  ) {
    fmxClass.AddMethodsWithReturnTypes(tsClass.getMethods(), famixRepo);
    /*
    console.log('**************************');
    console.log('Class: ' + tsClass.getName());
    tsClass.getMethods().forEach((meth) => {
      console.log('Method: ' + meth.getName() + ', Modifiers: ');
    });*/
  }

  public static addProperties(
    famixRepo: FamixRepository,
    fmxClass: Famix.Class,
    tsClass: ClassDeclaration
  ) {
    //fmxClass.AddProperties(tsClass.getProperties(), famixRepo);
    fmxClass.AddPropertiesWithTypes(tsClass.getProperties(), famixRepo);
  }

  public static AddDerivedClasses(
    famixRepo: FamixRepository,
    fmxClass: Famix.Class,
    tsClass: ClassDeclaration
  ) {
    fmxClass.AddDerivedClasses(tsClass.getDerivedClasses(), famixRepo);
  }
}
