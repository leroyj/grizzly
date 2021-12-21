export class GameEnvironment {
    constructor (public context:CanvasRenderingContext2D, readonly canvasSize:[number, number]=[800,600]) {
    }

    drawBackground() {
      // Créer un dégradé
      let lingrad = this.context.createLinearGradient(0, 0, 0, 600);
      lingrad.addColorStop(0, '#00ABEB');
      lingrad.addColorStop(0.66, '#fff');
      lingrad.addColorStop(0.66, '#26C000');
      lingrad.addColorStop(1, '#fff');
    
      this.context.fillStyle = lingrad;
      this.context.fillRect(10, 10, 790, 590);
    };
}

