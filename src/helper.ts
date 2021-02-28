import { FamixRepository } from './lib/famix_repository';
import * as Famix from "./lib/model/famix";
import { SourceFile, ClassDeclaration, InterfaceDeclaration, NamespaceDeclaration } from "ts-morph";
export class Helper {

    private _repository: FamixRepository;
    private _namespaces = new Map<string, Famix.Namespace>();

    public classes: ClassDeclaration[] = [];
    public interfaces: InterfaceDeclaration[] = [];

    constructor(repository: FamixRepository) {
        this._repository = repository;
    }

    public loadFileAnchors(sourceFile: SourceFile): Famix.IndexedFileAnchor {
        var fmxFileAnchor = new Famix.IndexedFileAnchor(this._repository);
        fmxFileAnchor.setFileName(sourceFile.getFilePath())
        fmxFileAnchor.setStartPos(sourceFile.getStartLineNumber())
        fmxFileAnchor.setEndPos(sourceFile.getEndLineNumber())
        return fmxFileAnchor;
    }

    public loadNamespace(namespaceDeclaration: NamespaceDeclaration){
        var name = namespaceDeclaration.getName();
        let fmxNamespace: Famix.Namespace;
        if (this._namespaces.has(name)) {
            fmxNamespace = this._namespaces.get(name);
        }
        else {
            fmxNamespace = new Famix.Namespace(this._repository);
            fmxNamespace.setName(name);
        }
        this._namespaces.set(name, fmxNamespace);
    }

    public loadClass(classDeclaration: ClassDeclaration, fmxFileAnchor: Famix.IndexedFileAnchor) {
        this.classes.push(classDeclaration);
        this.getFamiClass(classDeclaration.getName(), fmxFileAnchor, false);;
    }

    public loadInterface(interfaceDeclaration: InterfaceDeclaration, fmxFileAnchor: Famix.IndexedFileAnchor) {
        this.interfaces.push(interfaceDeclaration);
        this.getFamiClass(interfaceDeclaration.getName(), fmxFileAnchor, true);;
    }

    private getFamiClass(name: string, fmxFileAnchor: Famix.IndexedFileAnchor, isInterface: boolean) {
        var fmxClass = new Famix.Class(this._repository).UpdateInfo(name, fmxFileAnchor, isInterface);
        this._repository.addElement(fmxClass);
    }
}