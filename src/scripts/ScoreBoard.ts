export class ScoreBoard {
    private score:number;
    private context:CanvasRenderingContext2D;
    private remainingAmmunitions:number;
    private levelName:string;
    private messageDisplayed:string;

    constructor(score:number){
        this.score=score;
        this.context=this.createContext();
        this.remainingAmmunitions=99;
        this.levelName="Ready?";
        this.messageDisplayed="";
    }

    getScore():number {
        return this.score;
    }

    addPoints(points:number) {
        return this.score+=points;
    }

    setlevelName(levelName:string) {
        this.levelName =levelName;
    }

    setRemainingAmmunition (throwAmmunition:number) {
        this.remainingAmmunitions=throwAmmunition;
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

    private setMessageDisplayed(messageDisplayed:string) {
        console.debug("Set Message Displayed to : "+messageDisplayed)
        this.messageDisplayed=messageDisplayed;
    }

    resetMessageDisplayed() {
        console.debug("[ScoreBoard] Cleaning up Message Displayed")
        this.messageDisplayed="";
    }

    displayReadyToStart() {
        this.setMessageDisplayed("Press ⏎ to start!");
        console.debug("-> READY TO START! <-")
    }

    displayGameOver() {
        this.setMessageDisplayed("❤️ Game Over ❤️");
        console.debug("-> GAME OVER! <-")
        this.draw();
    }


    displayLevelCompleted() {
        this.setMessageDisplayed(this.levelName+" Completed!");
        console.log("-=< "+this.levelName+" Completed! >=-")
    }

    initialize () {
    }

    update(points:number) {
        this.score+=points;
    }

    draw() {
        const currentScore = this.score.toString();
        const paddedScore = currentScore.padStart(5, '0');
        this.context.clearRect(0,0,800,600);
        this.context.font = '48px Slackey';
        this.context.fillStyle = 'orange';
        this.context.strokeText(paddedScore, 20, 60);
        this.context.fillText(paddedScore, 20, 60);
        this.context.strokeText("🐟 "+this.remainingAmmunitions.toString(), 680, 60);
        this.context.fillText("🐟 "+this.remainingAmmunitions.toString(), 680, 60);
        //display levelName
        this.context.font = '30px Slackey';
        this.context.fillStyle = 'orange';
        this.context.strokeText(this.levelName, 350, 60);
        this.context.fillText(this.levelName, 350, 60);
        if (this.messageDisplayed!="") {
            this.context.globalAlpha=0.4;
            this.context.rect(0,0,800,600);
            this.context.fillStyle = 'black';
            this.context.fill();
            this.context.globalAlpha=1.0;
            this.context.font = '36px Slackey';
            this.context.fillStyle = 'lightgrey';
            this.context.lineWidth = 3;
            this.context.strokeText(this.messageDisplayed, 271, 301);
            this.context.fillText(this.messageDisplayed, 270, 300);
        }
      };    
}