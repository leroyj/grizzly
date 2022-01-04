export class GameEnvironment {
    image:HTMLImageElement;
    constructor (public context:CanvasRenderingContext2D, readonly canvasSize:[number, number]=[800,600],imagePath:string) {
      this.context = context;
      this.image = new Image();
      this.image.src = imagePath;
      let drawBackground = () => {
        this.context.drawImage(this.image, 0, 0);
      };
      this.image.onload = drawBackground;
    }


}

