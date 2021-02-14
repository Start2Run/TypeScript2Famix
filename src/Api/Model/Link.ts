/**
 * Cette classe permet de formater la liaison entre des elements
 */
export class Link {
    type: string;
    keyword: string;
    className: string;

    constructor(keyword: string, type: string,  className: string) {
        this.keyword = keyword;
        this.type = type;
        this.className = className;
    }
}