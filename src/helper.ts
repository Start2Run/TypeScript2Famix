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

    public createFileAnchor(name: string, start: number, end: number): Famix.IndexedFileAnchor {
        var fmxFileAnchor = new Famix.IndexedFileAnchor(this._repository);
        fmxFileAnchor.setFileName(name)
        fmxFileAnchor.setStartPos(start)
        fmxFileAnchor.setEndPos(end)
        return fmxFileAnchor;
    }

    public loadNamespace(namespaceDeclaration: NamespaceDeclaration): Famix.Namespace {
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
        return fmxNamespace;
    }

    public loadClass(classDeclaration: ClassDeclaration, fileName: string, fmxNameSpace: Famix.Namespace = null) {
        this.classes.push(classDeclaration);
        var fmxFileAnchor = this.createFileAnchor(fileName, classDeclaration.getStart(), classDeclaration.getEnd())
        var fmxClass = this.getFamiClass(classDeclaration.getName(), fmxFileAnchor, false);
        if (fmxNameSpace != null) {
            fmxClass.setContainer(fmxNameSpace);
        }
    }

    public loadInterface(interfaceDeclaration: InterfaceDeclaration, fileName: string, fmxNameSpace: Famix.Namespace = null) {
        this.interfaces.push(interfaceDeclaration);
        var fmxFileAnchor = this.createFileAnchor(fileName, interfaceDeclaration.getStart(), interfaceDeclaration.getEnd())
        var fmxClass = this.getFamiClass(interfaceDeclaration.getName(), fmxFileAnchor, true);
        if (fmxNameSpace != null) {
            fmxClass.setContainer(fmxNameSpace);
        }
    }

    private getFamiClass(name: string, fmxFileAnchor: Famix.IndexedFileAnchor, isInterface: boolean): Famix.Class {
        var fmxClass = new Famix.Class(this._repository).UpdateInfo(name, fmxFileAnchor, isInterface);
        this._repository.addElement(fmxClass);
        return fmxClass;
    }
}