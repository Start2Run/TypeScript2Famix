///<reference path='Brick.ts'/>

module MyNamespace {
  export class Wall {
    public wallWidth: number;
    public wallHeight: number;
    private wallDepth: number;

    constructor(w: number, h: number) {
      this.wallWidth = w;
      this.wallHeight = h;
      this.build();
    }

    public build(): void {
      for (var i: number = 0; i < this.wallHeight; i++) {
        for (var j: number = 0; j < this.wallWidth; j++) {
          var brick: Brick = new Brick();
        }
      }
    }

    private area(rounded: boolean, textValue: boolean): number {
      return this.wallHeight * this.wallWidth;
    }
  }
}
