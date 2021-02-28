import { FamixRepository } from '../lib/famix_repository';
import { IndexedFileAnchor } from '../lib/model/famix';
import { SourceFile } from 'ts-morph';

export class FileAnchor {
  public static add(
    famixRepo: FamixRepository,
    file: SourceFile
  ): IndexedFileAnchor {
    var fmxFileAnchor = new IndexedFileAnchor(famixRepo);
    fmxFileAnchor.setFileName(file.getFilePath());
    fmxFileAnchor.setStartPos(file.getStartLineNumber());
    fmxFileAnchor.setEndPos(file.getEndLineNumber());

    return fmxFileAnchor;
  }
}
