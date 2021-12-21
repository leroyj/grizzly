export class GameEnvironment {
    constructor (public context:CanvasRenderingContext2D, readonly canvasSize:[number, number]=[800,600]) {
    }

    drawBackground() {
      // Créer un dégradé
      /* Permalink - use to edit and share this gradient: https://colorzilla.com/gradient-editor/#2fdbf9+0,e2f4ff+67,158719+76,7c3333+100 */
      //background: linear-gradient(to bottom,  #2fdbf9 0%,#e2f4ff 67%,#158719 76%,#7c3333 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
    let lingrad = this.context.createLinearGradient(0, 0, 0, 600);
      lingrad.addColorStop(0, '#2fdbf9');
      lingrad.addColorStop(0.66, '#e2f4ff');
      lingrad.addColorStop(0.66, '#158719');
      lingrad.addColorStop(1, '#7c3333');
    
      this.context.fillStyle = lingrad;
      this.context.fillRect(0, 0, 800, 600);
    };
}

