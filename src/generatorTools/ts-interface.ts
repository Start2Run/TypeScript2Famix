import { FamixRepository } from '../lib/famix_repository';
import * as Famix from '../lib/model/famix';
import { InterfaceDeclaration } from 'ts-morph';

export class TsInterface {
  public static add(
    famixRepo: FamixRepository,
    tsInterface: InterfaceDeclaration,
    namespace: Famix.Namespace,
    fileAnchor: Famix.IndexedFileAnchor
  ) {
    var fmxClass = new Famix.Class(famixRepo).UpdateInfo(
      tsInterface.getName(),
      fileAnchor,
      true,
      namespace
    );
    famixRepo.addElement(fmxClass);
  }

  public static addMethods(
    famixRepo: FamixRepository,
    fmxClass: Famix.Class,
    tsInterface: InterfaceDeclaration
  ) {
    fmxClass.AddMethodsWithReturnTypes(tsInterface.getMethods(), famixRepo);
    /*console.log('**************************');
    console.log('Class: ' + tsInterface.getName());
    tsInterface.getMethods().forEach((meth) => {
      console.log(
        'Method: ' +
          meth.getName() +
          ', Return type: ' +
          meth.getReturnType().getText()
      );      
    });*/
  }

  public static addProperties(
    famixRepo: FamixRepository,
    fmxClass: Famix.Class,
    tsInterface: InterfaceDeclaration
  ) {
    //fmxClass.AddProperties(tsInterface.getProperties(), famixRepo);
    fmxClass.AddPropertiesWithTypes(tsInterface.getProperties(), famixRepo);
  }

  public static AddImplementations(
    famixRepo: FamixRepository,
    fmxClass: Famix.Class,
    tsInterface: InterfaceDeclaration
  ) {
    fmxClass.AddInterfaceImplementations(
      tsInterface.getImplementations(),
      famixRepo
    );
  }
}
