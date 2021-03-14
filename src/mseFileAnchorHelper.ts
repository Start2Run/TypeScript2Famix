import * as Famix from "./lib/model/famix";
import { FamixRepository } from './lib/famix_repository';

export class mseFileAnchorHelper {
    public static createFileAnchor(repository: FamixRepository, name: string, start: number, end: number): Famix.IndexedFileAnchor {
        var fmxFileAnchor = new Famix.IndexedFileAnchor(repository);
        fmxFileAnchor.setFileName(name)
        fmxFileAnchor.setStartPos(start)
        fmxFileAnchor.setEndPos(end)
        return fmxFileAnchor;
    }
}