/**
 * Cette classe retourne la structure d'une interface
 */
class Inherence {
    name: string;

    constructor(name: string) { 
        this.name = name;
    }

    loadStructure() : string[] {
        console.log("Je suis ici");
        return [];
    }
}