import * as Famix from './lib/model/famix';
import { FamixRepository } from './lib/famix_repository';
import { Class } from './lib/model/famix/class';
import {
  ClassDeclaration,
  ImplementationLocation,
  MethodDeclaration,
} from 'ts-morph';
import { TsProperty } from './generatorTools/ts-property';
import { TsMethod } from './generatorTools/ts-method';

declare module './lib/model/famix/class' {
  interface Class {
    UpdateInfo(
      name: string,      
      fmxFileAnchor: Famix.IndexedFileAnchor,
      isInterface: boolean,
	  fmxNamespace?: Famix.Namespace
    ): Class;
    AddMethods(methods: any[], famixRepository: FamixRepository);
    AddMethodsWithReturnTypes(methods: any[], famixRepository: FamixRepository);
    AddDerivedClasses(
      derivedClasses: ClassDeclaration[],
      famixRepository: FamixRepository
    );
    AddProperties(props: any[], famixRepository: FamixRepository);
    AddPropertiesWithTypes(props: any[], famixRepository: FamixRepository);
    AddInterfaceImplementations(
      implementations: ImplementationLocation[],
      famixRepository: FamixRepository
    );
  }
}

Class.prototype.UpdateInfo = function (name: string, fmxFileAnchor: Famix.IndexedFileAnchor, isInterface: boolean, fmxNamespace?: Famix.Namespace) {
    this.setName(name);
    this.setIsInterface(isInterface);
    if (fmxNamespace != null) {
        this.setContainer(fmxNamespace);
    }
    fmxFileAnchor.setElement(this);
    return this;
}

Class.prototype.AddMethods = function (methods: MethodDeclaration[], famixRepository: FamixRepository) {
    methods.forEach(method => {
        var fmxMethod = new Famix.Method(famixRepository);
        fmxMethod.setName(method.getName())
        fmxMethod.setKind(method.getKindName())
        var fmxFileAnchor = new Famix.IndexedFileAnchor(famixRepository);
        fmxFileAnchor.setStartPos(method.getStartLineNumber())
        fmxFileAnchor.setEndPos(method.getEndLineNumber())
        fmxFileAnchor.setElement(fmxMethod);
        
        fmxFileAnchor.setFileName(((this as Famix.Class).getSourceAnchor() as Famix.IndexedFileAnchor).getFileName());
        fmxMethod.setParentType(this);
        fmxMethod.setNumberOfLinesOfCode(method.getEndLineNumber() - method.getStartLineNumber());

        if (!(this as Famix.Class).getIsInterface()) {
            fmxMethod.addModifiers(method.getScope());
        }
    });
}

Class.prototype.AddMethodsWithReturnTypes = function (
  methods: MethodDeclaration[],
  famixRepository: FamixRepository
) {
  methods.forEach((method) => {
    TsMethod.add(this, famixRepository, method);
  });
};

Class.prototype.AddDerivedClasses = function (
  derivedClasses: ClassDeclaration[],
  famixRepository: FamixRepository
) {
  derivedClasses.forEach((derivedClass) => {
    var fmxInheritance = new Famix.Inheritance(famixRepository);
    var subclass = famixRepository.getFamixClass(derivedClass.getName());
    fmxInheritance.setSubclass(subclass);
    fmxInheritance.setSuperclass(this);
  });
};

Class.prototype.AddProperties = function (
  props: any[],
  famixRepository: FamixRepository
) {
  props.forEach((prop) => {
    var fmxAttribute = new Famix.Attribute(famixRepository);
    fmxAttribute.setName(prop.getName());
    fmxAttribute.setParentType(this);
  });
};

Class.prototype.AddPropertiesWithTypes = function (
  props: any[],
  famixRepository: FamixRepository
) {
  props.forEach((prop) => {
    TsProperty.add(this, famixRepository, prop);
  });
};

Class.prototype.AddInterfaceImplementations = function (
  implementations: ImplementationLocation[],
  famixRepository: FamixRepository
) {
  implementations.forEach((implementation) => {
    var fmxInheritance = new Famix.Inheritance(famixRepository);
    var subclass = famixRepository.getFamixClass(
      implementation.getNode().getText()
    );
    fmxInheritance.setSubclass(subclass);
    fmxInheritance.setSuperclass(this);
  });
};
