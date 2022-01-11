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
        gameEnv:GameEnv) {
            super();
            console.log("ThrowNot created: "+ positionX + positionY + Angle + Power + thrownObjectImagePath+gameEnv)
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
    Angle:number; 
    Power:number; 
    xInitialSpeedVector!:number; 
    yInitialSpeedVector!:number;
    xNormalizedSpeedVector!:number; 
    yNormalizedSpeedVector!:number;
    context:CanvasRenderingContext2D;
    projectile:Projectile[]=[];
    lastFire:number=new Date().valueOf();
    fireRate=3;
    ammunition:number=15;
    thrownObjectImagePath:string;
    gameEnv:GameEnv;
    keyboarder:Keyboarder;
 
    constructor (positionX:number, positionY:number, 
                Angle:number, Power:number,
                thrownObjectImagePath:string,
                gameEnv:GameEnv) {
        super();
        this.positionX=positionX;
        this.positionY=positionY;
        this.Angle=Angle;
        this.Power=Power;
        this.thrownObjectImagePath=thrownObjectImagePath;
        this.gameEnv=gameEnv;
        this.name="ArmToThrowFish";
        this.zIndex="15";
        this.keyboarder=gameEnv.getKeyboarder();
        this.computeSpeedVector();
        this.context=this.createContext();
     }

    /**
    *  convert angle from degree to Radian
    */
     degToRad(degrees:number) {
        return degrees * Math.PI / 180;
    };

    /**
    *  projection on the x and y axis of the initial velocity vector of the Projectile
    */
    private computeSpeedVector() {
        let armAngleRad = this.degToRad(this.Angle);
        this.xInitialSpeedVector=this.Power*Math.cos(armAngleRad);
        this.yInitialSpeedVector=this.Power*Math.sin(armAngleRad);
        this.xNormalizedSpeedVector=Math.cos(armAngleRad); 
        this.yNormalizedSpeedVector=Math.sin(armAngleRad);
    
    }

    /**
    *  Draw Grizzly arm
    */
     draw() {
        this.computeSpeedVector();
        this.context.clearRect(0,0,800, 600);
        this.context.save();
        this.context.beginPath();
        this.context.strokeStyle = 'red';
        this.context.lineWidth = 3;
        this.context.setLineDash([8, 2]);
        this.context.moveTo(this.positionX, this.positionY);
        this.context.lineTo(this.positionX+50*this.xNormalizedSpeedVector,this.positionY-50*this.yNormalizedSpeedVector);
        this.context.stroke();
        this.context.restore();
        this.context.save();
        this.context.beginPath();
        this.context.moveTo(30,550);
        this.context.strokeStyle = 'orange';
        this.context.lineCap = 'round';
        this.context.lineWidth = 12;
        this.context.lineTo(210,550);
        this.context.stroke();
        this.context.restore();
        this.context.save();
        this.context.beginPath();
        this.context.moveTo(30,550);
        this.context.strokeStyle = 'Red';
        this.context.lineWidth = 10;
        this.context.lineTo(30+this.Power*10,550);
        this.context.stroke();
        this.context.restore();
    }

    update() {
        this.keyboarder.keyState.SPACE && this.throwProjectile() && (this.keyboarder.keyState.SPACE=false);
        this.keyboarder.keyState.DOWN && this.lower();        
        this.keyboarder.keyState.UP && this.higher();
        this.keyboarder.keyState.LEFT && this.powerDown();
        this.keyboarder.keyState.RIGHT && this.powerUp();
        //console.log(this.projectile.length);
        // this.projectile.forEach( currentProjectile => {
        //     currentProjectile.update()
        // });
    }

    higher() {
        if (this.Angle < 120) { this.Angle+=1 }
      }
      
    lower() {
        if (this.Angle > 10) { this.Angle-=1 }
      }
      
    powerUp() {
        if (this.Power < 18) { this.Power+=0.1 }
      }
      
    powerDown() {
        if (this.Power > 8) { this.Power-=0.1 }
      }
    
    throwProjectile() {
        const cFire = new Date().valueOf();
        if (((cFire - this.lastFire) / 1000 > 1/this.fireRate) && (this.ammunition>0)) {            
            this.gameEnv.addGameObjectToList(new Projectile (
                                this.positionX, this.positionY,
                                this.positionX, this.positionY,
                                this.xInitialSpeedVector, this.yInitialSpeedVector,
                                0,
                                this.thrownObjectImagePath
            ));
            this.ammunition-=1;
            this.lastFire = cFire;
        }
    }

}

export const ThrowBehaviorStore: any = {
    ThrowNot,
    ThrowBalistics
}