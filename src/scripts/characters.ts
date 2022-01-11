import { JsonCharacter } from "./game";
import { GameEnv, GameObject } from "./GameObject";
import { MoveBehavior } from "./MoveBehavior";
import { ThrowBehavior } from "./ThrowBehavior";
import { MoveDynamicClass,ThrowDynamicClass } from "./DynamicClass";


/**
 * Character Class (grizzly, lemmings...)
 */
export class Character extends GameObject {
    name:string;
    zIndex:string;
    imagePath:string;
    positionX:number;
    positionY:number;
    image:HTMLImageElement;
    context:CanvasRenderingContext2D;
    moveBehavior!:MoveBehavior;
    throwBehavior!:ThrowBehavior;
    gameEnv:GameEnv;

    constructor (character:JsonCharacter,gameEnv:GameEnv) {
        super();
        this.name=character.name;
        this.zIndex=character.zIndex;
        this.imagePath=character.imagePath;
        this.positionX=character.positionX;
        this.positionY=character.positionY;
        this.gameEnv=gameEnv;
        this.context=this.createContext();

        try {
            this.moveBehavior = new MoveDynamicClass(character.moveBehavior, '');
            console.log(`Type of object : ${this.moveBehavior.constructor['name']}`);
            console.log(this.moveBehavior);
        } catch (e) {
            console.error(e);
        }

        try {
            this.throwBehavior = new ThrowDynamicClass(character.throwBehavior, this.positionX, this.positionY+100, character.throwAngle, character.throwPower, character.thrownObjectImagePath, gameEnv);
            // constructor (positionX:number, positionY:number, 
            //     Angle:number, Power:number,
            //     thrownObjectImagePath:string,
            //     gameEnv:GameEnv) {
            //this.throwBehavior = new ThrowDynamicClass(character.throwBehavior, this.positionX, this.positionY+100, character.throwAngle, character.throwPower, character.throwObjectImagePath);
            console.log(`Type of object : ${this.throwBehavior.constructor['name']}`);
            console.log(this.throwBehavior);
        } catch (e) {
            console.error(e);
        }

        // if (character.arm) {
        //     this.armObject=new GrizzlyArm(this.positionX, this.positionY+100, character.armAngle, character.armPower);
        //     console.log("arm created");
        //     console.log(this.armObject);
        // } else {
        //     this.armObject=null;
        // }
        this.image=new Image();
        this.image.src=character.imagePath; // with character images
    }

    update () {
        [this.positionX,this.positionY]=this.moveBehavior.move!(this.positionX,this.positionY);
        this.throwBehavior?.update();
    }

    draw () {
        this.context.clearRect(0,0,800, 600);
        this.context.drawImage(this.image,this.positionX,this.positionY);
        this.throwBehavior?.draw();
    }


}

/**
 * Projectile Class that deals with ballistic
 */
 export class Projectile extends GameObject {

    xCurrentPosition!:number;
    yCurrentPosition!:number;
    xNextPosition!:number;
    yNextPosition!:number;
    xInitialSpeedVector!:number;
    yInitialSpeedVector!:number;
    timestep!:number;
    sprite!:HTMLImageElement;
    thrownObjectImagePath!:string;
    context:CanvasRenderingContext2D;
    reqId:number=0;
    step:number=0;
    ready:boolean=false;

    constructor(xCurrentPosition:number, yCurrentPosition:number,
                xNextPosition:number, yNextPostition:number,
                xInitialSpeedVector:number, yInitialSpeedVector:number,
                timestep:number,
                thrownObjectImagePath:string
                ) {
        super();
        this.initialize(xCurrentPosition,yCurrentPosition,
                        xNextPosition,yNextPostition,
                        xInitialSpeedVector,yInitialSpeedVector,
                        timestep,
                        thrownObjectImagePath);
        this.name="projectile-"+timestep.toString();
        this.zIndex="20";
        this.context=this.createContext();
    }

    initialize(xCurrentPosition:number, yCurrentPosition:number,
            xNextPosition:number, yNextPosition:number,
            xInitialSpeedVector:number, yInitialSpeedVector:number,
            timestep:number,
            thrownObjectImagePath:string) {
        this.xCurrentPosition=xCurrentPosition;
        this.yCurrentPosition=yCurrentPosition;
        this.xNextPosition=xNextPosition;
        this.yNextPosition=yNextPosition;
        this.xInitialSpeedVector=xInitialSpeedVector;
        this.yInitialSpeedVector=yInitialSpeedVector;
        this.timestep=timestep;
        this.sprite = new Image();
        this.thrownObjectImagePath = thrownObjectImagePath;
        this.sprite.src = thrownObjectImagePath;
        console.log(this.sprite + " - " + this.xCurrentPosition  + " - " +  this.yCurrentPosition)
        this.sprite.onload = () => {this.ready=true; console.log("INFO: fish image onload done")};
//        this.sprite.onload = this.animate.bind(this);
//        this.context.imageSmoothingEnabled = false;
//        this.context.moveTo(this.xCurrentPosition,this.yCurrentPosition);
    }

    update () {
        if (this.ready) {
            if (this.yNextPosition<-100 || this.yNextPosition>550 || this.xNextPosition>800 || this.xNextPosition<0) {
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
