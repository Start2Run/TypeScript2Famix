import { FamixRepository } from '../lib/famix_repository';
import * as Famix from '../lib/model/famix';
import { NamespaceDeclaration } from 'ts-morph';

export class Namespace {
  public static add(
    famixRepo: FamixRepository,
    namespace: NamespaceDeclaration,
    namespaces: Map<string, Famix.Namespace>
  ): Famix.Namespace {
    var name = namespace.getName();

    let fmxNamespace: Famix.Namespace;
    if (namespaces.has(name)) {
      fmxNamespace = namespaces.get(name);
    } else {
      fmxNamespace = new Famix.Namespace(famixRepo);
      fmxNamespace.setName(name);
    }
    namespaces.set(name, fmxNamespace);

    return fmxNamespace;
  }
}
