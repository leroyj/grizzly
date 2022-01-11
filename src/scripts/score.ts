export class Score {
    score:number;
    context:CanvasRenderingContext2D;
    projectileCount:number;

    constructor(score:number){
        this.score=score;
        this.projectileCount=15;
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

    addMessage(message:string) {
        this.context.globalAlpha=0.2;
        this.context.rect(0,0,800,600);
        this.context.fillStyle = 'black';
        this.context.fill();
        this.context.globalAlpha=1.0;
        this.context.font = '36px sans-serif';
        this.context.fillStyle = 'lightgrey';
        this.context.lineWidth = 3;
        this.context.strokeText(message, 271, 301);
        this.context.fillText(message, 270, 300);
    }

    projectileCountdown () {
        this.projectileCount-=1;
    }

    initialize () {
    }

    update(points:number) {
        this.score+=points;
    }

    draw() {
        if (this.projectileCount<1) {
            this.context.clearRect(0,0,800,600);
            this.addMessage("Game Over")
        } else {
            const currentScore = this.score.toString();
            const paddedScore = currentScore.padStart(5, '0');
            this.context.clearRect(0,0,800,600);
            this.context.font = '48px sans-serif';
            this.context.fillStyle = 'orange';
            this.context.strokeText(paddedScore, 20, 60);
            this.context.fillText(paddedScore, 20, 60);
            this.context.strokeText(this.projectileCount.toString(), 700, 60);
            this.context.fillText(this.projectileCount.toString(), 700, 60);
        }
      };    
}