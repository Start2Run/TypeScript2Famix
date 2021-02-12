import * as Famix from "./lib/model/famix";
import { FamixRepository } from './lib/famix_repository';
import {Method} from "./lib/model/famix/method";

declare module './lib/model/famix/method' {
    interface Method {
        updateInfo(name: string, fmxNamespace: Famix.Namespace, fmxFileAnchor: Famix.FileAnchor, isInterface: boolean);
    }
}

Method.prototype.updateInfo = function (name: string, fmxNamespace: Famix.Namespace, fmxFileAnchor: Famix.FileAnchor, isInterface: boolean) {
    var fileName = name;
    this.setName(fileName);
    this.setIsInterface(isInterface);
    this.setContainer(fmxNamespace);
    fmxFileAnchor.setElement(this);
}