import { FamixRepository } from '../lib/famix_repository';
import { Class as FamixClass, Method } from '../lib/model/famix';
import { MethodDeclaration } from 'ts-morph';
import { TsType } from './ts-type';

export class TsMethod {
  public static add(
    fmxClass: FamixClass,
    famixRepo: FamixRepository,
    method: MethodDeclaration
  ) {
    var fmxMethod = new Method(famixRepo);
    fmxMethod.setName(method.getName());
    fmxMethod.setParentType(fmxClass);
    fmxMethod.setNumberOfLinesOfCode(
      method.getEndLineNumber() - method.getStartLineNumber()
    );

    fmxMethod.setDeclaredType(
      TsType.add(method.getReturnType().getText(), famixRepo)
    );

    this.addMethodSignature(fmxMethod, method);

    this.addMethodModifier(fmxMethod, method);
  }

  private static addMethodSignature(
    fmxMethod: Method,
    method: MethodDeclaration
  ) {
    let signature = method
      .getParameters()
      .map((parameter) => parameter.getText())
      .toString();

    if (signature.length > 0) fmxMethod.setSignature(signature);
  }

  private static addMethodModifier(
    fmxMethod: Method,
    method: MethodDeclaration
  ) {
    if (method.hasModifier)
      fmxMethod.addModifiers(
        method
          .getModifiers()
          .map((modifier) => modifier.getText())
          .toString()
      );
  }
}
