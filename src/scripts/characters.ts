import { JsonCharacter } from "./game";
import fishUrl from '../assets/fish.png';
import { Keyboarder } from "./Keyboarder"
import { GameObject } from "./GameObject";

/**
 * Character Class (grizzly, lemmings...)
 */
export class Character extends GameObject {
    name:string;
    zIndex:string;
    imagePath:string;
    positionX:number;
    positionY:number;
    armObject:GrizzlyArm|null;
    image:HTMLImageElement;
    context:CanvasRenderingContext2D;
    keyboarder:Keyboarder;

    constructor (character:JsonCharacter,keyboarder:Keyboarder) {
        super();
        this.name=character.name;
        this.zIndex=character.zIndex;
        this.imagePath=character.imagePath;
        this.positionX=character.positionX;
        this.positionY=character.positionY;
        this.keyboarder=keyboarder;
        this.context=this.createContext();
        if (character.arm) {
            this.armObject=new GrizzlyArm(this.positionX, this.positionY+100, character.armAngle, character.armPower);
            console.log("arm created");
            console.log(this.armObject);
        } else {
            this.armObject=null;
        }
        this.image=new Image();
        this.image.src=character.imagePath; // with character images
    }

    update () {
        this.armObject?.update(this.keyboarder);
    }

    draw () {
        this.context.clearRect(0,0,800, 600);
        this.context.drawImage(this.image,this.positionX,this.positionY);
        this.armObject?.draw(this.context);
    }

}

/**
 * GrizzlyArm Class that deals with setting the speed and angle of the throw
 */
export class GrizzlyArm {
    positionX:number; 
    positionY:number; 
    Angle:number; 
    Power:number; 
    xInitialSpeedVector!:number; 
    yInitialSpeedVector!:number;
    projectile:Projectile[]=[];
    lastFire:number=new Date().valueOf();
    fireRate=3;
    ammunition:number=15;
 
    constructor (positionX:number, positionY:number, 
                Angle:number, Power:number) {
        this.positionX=positionX;
        this.positionY=positionY;
        this.Angle=Angle;
        this.Power=Power;
        this.computeSpeedVector();
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
    }

    /**
    *  Draw Grizzly arm
    */
     draw(context:CanvasRenderingContext2D) {
        this.computeSpeedVector();
        context.save();
        context.beginPath();
        context.strokeStyle = 'black';
        context.lineWidth = 3;
        context.setLineDash([8, 2]);
        context.moveTo(this.positionX, this.positionY);
        context.lineTo(this.positionX+2*this.xInitialSpeedVector,this.positionY-2*this.yInitialSpeedVector);
        context.lineTo(this.positionX+2*this.xInitialSpeedVector-5,this.positionY-2*this.yInitialSpeedVector);
        context.stroke();
        context.restore();
    }

    update(keyboarder:Keyboarder) {
        keyboarder.keyState.SPACE && this.throwProjectile() && (keyboarder.keyState.SPACE=false);
        keyboarder.keyState.DOWN && this.lower();        
        keyboarder.keyState.UP && this.higher();
        keyboarder.keyState.LEFT && this.powerDown();
        keyboarder.keyState.RIGHT && this.powerUp();
        //console.log(this.projectile.length);
        this.projectile.forEach( currentProjectile => {
            currentProjectile.update()
        });
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
            this.projectile.push(new Projectile (
                                this.positionX, this.positionY,
                                this.positionX, this.positionY,
                                this.xInitialSpeedVector, this.yInitialSpeedVector,
                                0
            ));
            this.ammunition-=1;
            this.lastFire = cFire;
        }
        console.log("Nb of projectile in the queue: " + this.projectile.length);
    }

}

/**
 * Projectile Class that deals with ballistic
 */
 export class Projectile {

    xCurrentPosition!:number;
    yCurrentPosition!:number;
    xNextPosition!:number;
    yNextPosition!:number;
    xInitialSpeedVector!:number;
    yInitialSpeedVector!:number;
    timestep!:number;
    sprite!:HTMLImageElement;
    imagePath!:string;
    context:CanvasRenderingContext2D;
    reqId:number=0;
    step:number=0;
    ready:boolean=false;

    constructor(xCurrentPosition:number, yCurrentPosition:number,
                xNextPosition:number, yNextPostition:number,
                xInitialSpeedVector:number, yInitialSpeedVector:number,
                timestep:number
                ) {
        this.initialize(xCurrentPosition,yCurrentPosition,
                        xNextPosition,yNextPostition,
                        xInitialSpeedVector,yInitialSpeedVector,
                        timestep);
        this.context=this.createContext();
    }

    private createContext():CanvasRenderingContext2D {
        const canvas = document.createElement('canvas');
        canvas.id = "Projectile-" + Math.floor(Math.random()*1000);
        canvas.width = 800;
        canvas.height = 600;
        canvas.style.zIndex = "10";
        canvas.style.position = "absolute";
        const gameElement:Element = document.getElementById('game') ?? (() => {throw new Error("ERROR: No game Element in HTML page")})();
        gameElement.appendChild(canvas);
        return canvas.getContext('2d') ?? (() => {throw new Error("ERROR: No background context")})();
    }

    initialize(xCurrentPosition:number, yCurrentPosition:number,
            xNextPosition:number, yNextPosition:number,
            xInitialSpeedVector:number, yInitialSpeedVector:number,
            timestep:number) {
        this.xCurrentPosition=xCurrentPosition;
        this.yCurrentPosition=yCurrentPosition;
        this.xNextPosition=xNextPosition;
        this.yNextPosition=yNextPosition;
        this.xInitialSpeedVector=xInitialSpeedVector;
        this.yInitialSpeedVector=yInitialSpeedVector;
        this.timestep=timestep;
        this.sprite = new Image();
        this.imagePath = fishUrl;
        this.sprite.src = fishUrl;
        console.log(this.sprite + " - " + this.xCurrentPosition  + " - " +  this.yCurrentPosition)
        this.sprite.onload = () => {this.ready=true; console.log("INFO: fish image onload done")};
//        this.sprite.onload = this.animate.bind(this);
//        this.context.imageSmoothingEnabled = false;
//        this.context.moveTo(this.xCurrentPosition,this.yCurrentPosition);
    }

    update () {
        if (this.ready) {
            if (this.yNextPosition<-100 || this.yNextPosition>500 || this.xNextPosition>800 || this.xNextPosition<0) {
                this.ready=false;
            } else {
                this.xCurrentPosition=this.xNextPosition;
                this.yCurrentPosition=this.yNextPosition;
                this.xNextPosition=Math.round(this.xInitialSpeedVector*this.timestep+this.xCurrentPosition);
                this.yNextPosition=Math.round(5*this.timestep*this.timestep-this.yInitialSpeedVector*this.timestep+this.yCurrentPosition);
                console.log("t:"+this.timestep+" x:"+this.xNextPosition+" y:"+this.yNextPosition+" oldx:"+this.xCurrentPosition+" oldy:"+this.yCurrentPosition)
                this.timestep+=0.1;
                this.step += 0.3 ;
                if (this.step >= 8)
                    this.step -= 8;
            };
        }
    } 

    draw () {
        if (this.ready) {
            this.context.clearRect(this.xCurrentPosition-32,this.yCurrentPosition-32,64,64 );
            this.drawProjectile(this.context,this.xNextPosition,this.yNextPosition, 2, Math.floor(this.step));
        }
    }

    drawProjectile(context:CanvasRenderingContext2D,x:number, y:number, r:number, step:number) {
        var s =r/8;
        context.drawImage(this.sprite, 128*step, 0, 128, 128, x-64*s, y-64*s, 128*s, 128 *s);
    }

}
