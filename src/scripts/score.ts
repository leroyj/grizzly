export class Score {
    score:number;
    context:CanvasRenderingContext2D;

    constructor(score:number){
        this.score=score;
        this.context=this.createContext();
    }

    private createContext():CanvasRenderingContext2D {
        const canvas = document.createElement('canvas');
        canvas.id = "uicontext";
        canvas.width = 800;
        canvas.height = 600;
        canvas.style.zIndex = "100";
        canvas.style.position = "absolute";
        const gameElement:Element = document.getElementById('game') ?? (() => {throw new Error("ERROR: No game Element in HTML page")})();
        gameElement.appendChild(canvas);
        return canvas.getContext('2d') ?? (() => {throw new Error("ERROR: No background context")})();
    }

    initialize () {
    }

    update(points:number) {
        this.score+=points;
    }

    draw() {
        this.context.font = '48px sans-serif';
        this.context.strokeText(this.score.toString(), 20, 60);
      };    
}