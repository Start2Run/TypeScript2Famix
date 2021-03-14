import { FamixRepository } from './lib/famix_repository';
import { MethodDeclaration, ParameterDeclaration } from "ts-morph";
import * as Famix from "./lib/model/famix";
import { mseFileAnchorHelper } from './mseFileAnchorHelper';

const cyclomatic = require('./cyclomatic');

export class mseMethodHelper {
  private _repository: FamixRepository;

  constructor(repository: FamixRepository) {
    this._repository = repository;
  }

  public addMethods(methodDeclarations: MethodDeclaration[], fmxClass: Famix.Class) {
    var fileName=(fmxClass.getSourceAnchor() as Famix.IndexedFileAnchor).getFileName()
    var cc = cyclomatic.calculate(fileName);
    methodDeclarations.forEach(method => {
      this.addMethod(method, fmxClass, cc,fileName)
    });
  }

  private addMethod(method: MethodDeclaration, fmxClass: Famix.Class, cc: any, fileName:string) {
    var fmxMethod = new Famix.Method(this._repository)
    fmxMethod.setName(method.getName())
    fmxMethod.setKind(method.getKindName())
    fmxMethod.setParentType(fmxClass)
    fmxMethod.setNumberOfLinesOfCode(method.getEndLineNumber() - method.getStartLineNumber());
    fmxMethod.setCyclomaticComplexity(cc[method.getName()])
    this.setSignature(fmxMethod, method)

    var indexedFileAnchor = mseFileAnchorHelper.createFileAnchor(this._repository, fileName, method.getStart(), method.getEnd())
    indexedFileAnchor.setElement(fmxMethod)

    if (!fmxClass.getIsInterface()) {
      fmxMethod.addModifiers(method.getScope())
      fmxMethod.setNumberOfStatements(method.getStatements().length)
    }
    this.addParameters(method, fmxMethod)
  }

  private setSignature(fmxMethod: Famix.Method, method: MethodDeclaration) {
    let signature = method.getName()
      + "("
      + method
        .getParameters()
        .map((parameter) => parameter.getText())
        .toString()
      + ")";

    fmxMethod.setSignature(signature)
  }

  private addParameters = function (method: MethodDeclaration, fmxMethod: Famix.Method) {
    method.getParameters().forEach(param => {
      this.addParameter(param, fmxMethod)
    });
  }

  private addParameter(parameter: ParameterDeclaration, fmxMethod: Famix.Method) {
    var fmxParameter = new Famix.Parameter(this._repository)
    fmxParameter.setName(parameter.getName())
    fmxParameter.setParentBehaviouralEntity(fmxMethod)
    var fmxFileAnchor = mseFileAnchorHelper.createFileAnchor(this._repository, (fmxMethod.getSourceAnchor() as Famix.IndexedFileAnchor).getFileName(), parameter.getStart(), parameter.getEnd())
    fmxFileAnchor.setElement(fmxParameter)
  }
}