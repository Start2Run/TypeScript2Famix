import './mseFileAnchorHelper';
import { ClassDeclaration, InterfaceDeclaration } from 'ts-morph';
import * as Famix from './lib/model/famix';
import { MseFileAnchorHelper } from './mseFileAnchorHelper';
import { FamixRepository } from './lib/famix_repository';

export class MseClassHelper {
  private _repository: FamixRepository;

  constructor(repository: FamixRepository) {
    this._repository = repository;
  }

  public loadClass(classDeclaration: ClassDeclaration, sourceFileName: string, fmxNameSpace: Famix.Namespace = null) {
    const fmxFileAnchor = MseFileAnchorHelper.createFileAnchor(
      this._repository,
      sourceFileName,
      classDeclaration.getStart(),
      classDeclaration.getEnd(),
    );
    const fmxClass = this.getFamiClass(classDeclaration.getName(), fmxFileAnchor, false);
    if (fmxNameSpace != null) {
      fmxClass.setContainer(fmxNameSpace);
    }
  }

  public loadInterface(
    interfaceDeclaration: InterfaceDeclaration,
    sourceFileName: string,
    fmxNameSpace: Famix.Namespace = null,
  ) {
    const fmxFileAnchor = MseFileAnchorHelper.createFileAnchor(
      this._repository,
      sourceFileName,
      interfaceDeclaration.getStart(),
      interfaceDeclaration.getEnd(),
    );
    const fmxClass = this.getFamiClass(interfaceDeclaration.getName(), fmxFileAnchor, true);
    if (fmxNameSpace != null) {
      fmxClass.setContainer(fmxNameSpace);
    }
  }

  private getFamiClass(name: string, fmxFileAnchor: Famix.IndexedFileAnchor, isInterface: boolean): Famix.Class {
    const fmxClass = new Famix.Class(this._repository);
    this.updateInfo(fmxClass, name, fmxFileAnchor, isInterface);
    this._repository.addElement(fmxClass);
    return fmxClass;
  }

  private updateInfo(
    famixClass: Famix.Class,
    name: string,
    fmxFileAnchor: Famix.IndexedFileAnchor,
    isInterface: boolean,
    fmxNamespace?: Famix.Namespace,
  ) {
    famixClass.setName(name);
    famixClass.setIsInterface(isInterface);
    if (fmxNamespace != null) {
      famixClass.setContainer(fmxNamespace);
    }
    fmxFileAnchor.setElement(famixClass);
  }
}
