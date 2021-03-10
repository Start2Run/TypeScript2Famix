import * as Famix from './lib/model/famix';
import { FamixRepository } from './lib/famix_repository';
import { Class } from './lib/model/famix/class';
import './FmxMethodExternsions'
import { TsProperty } from './generatorTools/ts-property';
import { TsMethod } from './generatorTools/ts-method';

const cyclomatic = require('./cyclomatic');
const { ScriptTarget } = require('typescript');

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
      derivedClasses: any[],
      famixRepository: FamixRepository
    );
    AddProperties(props: any[], famixRepository: FamixRepository);
    AddParameter(props: any[], famixRepository: FamixRepository);
    AddPropertiesWithTypes(props: any[], famixRepository: FamixRepository);
    AddInterfaceImplementations(
      implementations: any[],
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

Class.prototype.AddMethods = function (methods: any[], famixRepository: FamixRepository) {
 
  var cc = cyclomatic.calculate((this.getSourceAnchor() as Famix.IndexedFileAnchor).getFileName(), ScriptTarget.ES2015);
 
  methods.forEach(method => {
    var fmxMethod = new Famix.Method(famixRepository)
    fmxMethod.setName(method.getName())
    fmxMethod.setKind(method.getKindName())
    fmxMethod.SetFileAnchor(famixRepository, (this.getSourceAnchor() as Famix.IndexedFileAnchor).getFileName(), method.getStart(), method.getEnd())
    fmxMethod.setParentType(this)
    fmxMethod.setNumberOfLinesOfCode(method.getEndLineNumber() - method.getStartLineNumber());
    fmxMethod.setCyclomaticComplexity(cc[method.getName()])

    let signature = method.getName()
      + "("
      + method
        .getParameters()
        .map((parameter) => parameter.getText())
        .toString()
      + ")";

    fmxMethod.setSignature(signature);

    if (!(this as Famix.Class).getIsInterface()) {
      fmxMethod.addModifiers(method.getScope());
      fmxMethod.setNumberOfStatements(method.getStatements().length);
    }
    fmxMethod.AddParameters(method.getParameters(), famixRepository);
  });
}

Class.prototype.AddMethodsWithReturnTypes = function (
  methods: any[],
  famixRepository: FamixRepository
) {
  methods.forEach((method) => {
    TsMethod.add(this, famixRepository, method);
  });
};

Class.prototype.AddDerivedClasses = function (
  derivedClasses: any[],
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
    fmxAttribute.addModifiers(prop.getScope());
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
  implementations: any[],
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
