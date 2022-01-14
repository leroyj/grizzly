import { Projectile } from "./characters";
import { GameEnv, GameObject } from "./GameObject";
import { Keyboarder } from "./Keyboarder";
export interface ThrowBehavior extends GameObject {
    throwProjectile?():void;
}

export class ThrowNot extends GameObject implements ThrowBehavior {
    constructor (positionX:number, positionY:number, 
        Angle:number, Power:number,
        thrownObjectImagePath:string,
        throwAmmunition:number,
        gameEnv:GameEnv) {
            super();
            console.debug("ThrowNot created - posx:"+ positionX + 
                                            " posy:"+ positionY + 
                                            " Angle:"+Angle + 
                                            " Power:"+Power + 
                                            " ThrwnImgPth:"+thrownObjectImagePath+
                                            " Ammo:"+throwAmmunition+
                                            "GameEnv:"+gameEnv)
        };
    throwProjectile():void {
        //Nada
    }
    draw() {
    }
    update (){
    }
}

export class ThrowBalistics extends GameObject implements ThrowBehavior{
    positionX:number; 
    positionY:number; 
    angleOfVelocityVector:number; 
    powerAsNormOfVelocityVector:number; 
    xInitialVelocityVector!:number; 
    yInitialVelocityVector!:number;
    xNormalizedVelocityVector!:number; 
    yNormalizedVelocityVector!:number;
    context:CanvasRenderingContext2D;
    lastFire:number=new Date().valueOf();
    fireRate=3;
    remainingAmmunitions:number;
    thrownObjectImagePath:string;
    gameEnv:GameEnv;
    keyboarder:Keyboarder;
    audio:HTMLAudioElement;
 
    constructor (positionX:number, positionY:number, 
                Angle:number, Power:number,
                thrownObjectImagePath:string,
                throwAmmunition:number,
                gameEnv:GameEnv) {
        super();
        this.positionX=positionX;
        this.positionY=positionY;
        this.angleOfVelocityVector=Angle;
        this.powerAsNormOfVelocityVector=Power;
        this.remainingAmmunitions=throwAmmunition;
        console.debug("[ThrowBalistics] Ammunitions construct: "+this.remainingAmmunitions);
        this.thrownObjectImagePath=thrownObjectImagePath;
        this.gameEnv=gameEnv;
        this.gameEnv.setremainingAmmunitions(this.remainingAmmunitions);
        this.name="ArmToThrowFish";
        this.zIndex="15";
        this.keyboarder=gameEnv.getKeyboarder();
        this.computeSpeedVector();
        this.context=this.createContext();
        console.debug("[ThrowBalistics] ThrowBalistics created - posx:"+ positionX + 
        " posy:"+ positionY + 
        " Angle:"+Angle + 
        " Power:"+Power + 
        " ThrwnImgPth:"+thrownObjectImagePath+
        " Ammo:"+throwAmmunition+
        "GameEnv:"+gameEnv)
        this.audio = new Audio("/throw.mp4");
        this.audio.volume=0.5;
     }

    /**
    *  convert angle from degree to Radian
    */
    private degToRad(degrees:number) {
        return degrees * Math.PI / 180;
    };

    /**
    *  projection on the x and y axis of the initial velocity vector of the Projectile
    */
    private computeSpeedVector() {
        let armAngleRad = this.degToRad(this.angleOfVelocityVector);
        this.xInitialVelocityVector=this.powerAsNormOfVelocityVector*Math.cos(armAngleRad);
        this.yInitialVelocityVector=this.powerAsNormOfVelocityVector*Math.sin(armAngleRad);
        this.xNormalizedVelocityVector=Math.cos(armAngleRad); 
        this.yNormalizedVelocityVector=Math.sin(armAngleRad);
    
    }

    /**
    *  Draw Grizzly arm
    */
     draw() {
        const tox = this.positionX+50*this.xNormalizedVelocityVector;
        const toy = this.positionY-50*this.yNormalizedVelocityVector;
        const dx = tox - this.positionX;
        const dy = toy - this.positionY;
        const angle = Math.atan2(dy, dx);
        const headlen = 10;
        // Compute initial velocity vector
        this.computeSpeedVector();
        // Clear Canvas
        this.context.clearRect(0,0,800, 600);
        this.context.save();
        // Draw Vector Body
        this.context.beginPath();
        this.context.strokeStyle = 'red';
        this.context.lineWidth = 3;
        this.context.setLineDash([8, 2]);
        this.context.moveTo(this.positionX, this.positionY);
        this.context.lineTo(tox,toy);
        // Draw Vector Array
        this.context.lineTo(tox - headlen * Math.cos(angle - Math.PI / 6), toy - headlen * Math.sin(angle - Math.PI / 6));
        this.context.moveTo(tox, toy);
        this.context.lineTo(tox - headlen * Math.cos(angle + Math.PI / 6), toy - headlen * Math.sin(angle + Math.PI / 6));
        this.context.stroke();
        this.context.restore();
        // Draw Power Bar (norm of the velocity vector)
        this.context.save();
        this.context.beginPath();
        this.context.moveTo(30,550);
        this.context.strokeStyle = 'orange';
        this.context.lineCap = 'round';
        this.context.lineWidth = 12;
        this.context.lineTo(233,550);
        this.context.stroke();
        this.context.restore();
        this.context.save();
        this.context.beginPath();
        this.context.moveTo(30,550);
        this.context.strokeStyle = 'Red';
        this.context.lineCap = 'round';
        this.context.lineWidth = 10;
        this.context.lineTo(30+(this.powerAsNormOfVelocityVector-14.9)*20,550);
        this.context.stroke();
        this.context.restore();
    }

    update() {
        if (this.keyboarder.keyState.SPACE) {
            console.log("[ThrowBalistics.update] SPACE key handled by ThrowBalistics");
            this.keyboarder.keyState.SPACE=false;
            console.log("[ThrowBalistics.update] SPACE key: "+this.keyboarder.keyState.SPACE);
            console.log("[ThrowBalistics.update] remainingAmmunitions: "+this.remainingAmmunitions);
            this.throwProjectile();
        }  
        this.keyboarder.keyState.DOWN && this.lower();        
        this.keyboarder.keyState.UP && this.higher();
        this.keyboarder.keyState.LEFT && this.powerDown();
        this.keyboarder.keyState.RIGHT && this.powerUp();
    }

    private higher() {
        if (this.angleOfVelocityVector < 120) { this.angleOfVelocityVector+=1 }
      }
      
    private lower() {
        if (this.angleOfVelocityVector > 10) { this.angleOfVelocityVector-=1 }
      }
      
    private powerUp() {
        if (this.powerAsNormOfVelocityVector < 30) { this.powerAsNormOfVelocityVector+=0.1 }
      }
      
    private powerDown() {
        if (this.powerAsNormOfVelocityVector > 15) { this.powerAsNormOfVelocityVector-=0.1 }
      }
    
    throwProjectile() {
        if (this.remainingAmmunitions<1) {
            this.gameEnv.levelcompleted();
            return;
        }
        const cFire = new Date().valueOf();
        if ((cFire - this.lastFire) / 1000 > 1/this.fireRate) { 
            console.log("[ThrowBalistics.throwProjectile] remainingAmmunitions: "+this.remainingAmmunitions) 
            this.loadThrowSound();          
            this.gameEnv.addGameObjectToList(new Projectile (
                                this.positionX, this.positionY,
                                this.positionX, this.positionY,
                                this.xInitialVelocityVector, this.yInitialVelocityVector,
                                this.thrownObjectImagePath)
            );
            this.remainingAmmunitions=this.remainingAmmunitions-1;
            this.gameEnv.setremainingAmmunitions(this.remainingAmmunitions);
            this.lastFire = cFire;
        }
    }

    private loadThrowSound (){
        this.audio.play();
      }
    

}

export const ThrowBehaviorStore: any = {
    ThrowNot,
    ThrowBalistics
}