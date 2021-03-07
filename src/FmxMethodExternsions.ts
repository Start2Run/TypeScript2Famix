import * as Famix from "./lib/model/famix";
import { FamixRepository } from './lib/famix_repository';
import { Method } from "./lib/model/famix/method";
import './FmxParameterExternsions'
declare module './lib/model/famix/method' {
    interface Method {
        UpdateInfo(name: string, fmxNamespace: Famix.Namespace, fmxFileAnchor: Famix.FileAnchor, isInterface: boolean);
        SetFileAnchor(famixRepository: FamixRepository, sourceFileName: string, startPos: any, endPos: any);
        AddParameters(param: any, famixRepository: FamixRepository);
    }
}

Method.prototype.UpdateInfo = function (name: string, fmxNamespace: Famix.Namespace, fmxFileAnchor: Famix.FileAnchor, isInterface: boolean) {
    var fileName = name;
    this.setName(fileName);
    this.setIsInterface(isInterface);
    this.setContainer(fmxNamespace);
    fmxFileAnchor.setElement(this);
}

Method.prototype.SetFileAnchor = function (famixRepository: FamixRepository, sourceFileName: string, startPos: any, endPos: any) {
    var fmxFileAnchor = new Famix.IndexedFileAnchor(famixRepository);
    fmxFileAnchor.setStartPos(startPos);
    fmxFileAnchor.setEndPos(endPos);
    fmxFileAnchor.setElement(this);
    fmxFileAnchor.setFileName(sourceFileName);
}

Method.prototype.AddParameters = function (params: any[], famixRepository: FamixRepository) {
    params.forEach(param => {
        var fmxParameter = new Famix.Parameter(famixRepository);
        fmxParameter.setName(param.getName());
        fmxParameter.setParentBehaviouralEntity(this);
        fmxParameter.SetFileAnchor(famixRepository, (this.getSourceAnchor() as Famix.IndexedFileAnchor).getFileName(),param.getStartLineNumber(), param.getEndLineNumber());
    });
}