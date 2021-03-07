import * as Famix from "./lib/model/famix";
import { FamixRepository } from './lib/famix_repository';
import { Parameter } from "./lib/model/famix/parameter";

declare module './lib/model/famix/parameter' {
    interface Parameter {
        UpdateInfo(name: string);
        SetFileAnchor(famixRepository: FamixRepository, sourceFileName: string, startPos: any, endPos: any);
    }
}

Parameter.prototype.SetFileAnchor = function (famixRepository: FamixRepository, sourceFileName: string, startPos: any, endPos: any) {
    var fmxFileAnchor = new Famix.IndexedFileAnchor(famixRepository);
    fmxFileAnchor.setStartPos(startPos);
    fmxFileAnchor.setEndPos(endPos);
    fmxFileAnchor.setElement(this);
    fmxFileAnchor.setFileName(sourceFileName);
}