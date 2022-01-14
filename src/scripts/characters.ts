import { JsonCharacter } from "./JsonLevelType";
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
    moveBehavior!:MoveBehavior;
    throwBehavior!:ThrowBehavior;
    gameEnv:GameEnv;
    offsetOfSprite:number;
    collisionDetection:boolean;
    pointsToScore:number;

    constructor (character:JsonCharacter,gameEnv:GameEnv) {
        super();
        this.name=character.name;
        this.zIndex=character.zIndex;
        this.imagePath=character.imagePath;
        this.positionX=character.positionX;
        this.positionY=character.positionY;
        this.gameEnv=gameEnv;
        this.context=this.createContext();
        this.offsetOfSprite=0;
        this.collisionDetection=character.collisionDetection;
        this.pointsToScore=character.pointsToScore;


        try {
            this.moveBehavior = new MoveDynamicClass(character.moveBehavior, '');
            console.debug(`[Character.constructor] Type of moveBehavior : ${this.moveBehavior.constructor['name']}`);
            console.debug(this.moveBehavior);
        } catch (e) {
            console.error(e);
        }

        try {
            this.throwBehavior = new ThrowDynamicClass(
                character.throwBehavior, 
                this.positionX, 
                this.positionY+100, 
                character.throwAngle, 
                character.throwPower, 
                character.thrownObjectImagePath, 
                character.throwAmmunition,
                gameEnv);
            console.debug(`[Character.constructor] Type of throwBehavior : ${this.throwBehavior.constructor['name']}`);
            console.debug(this.throwBehavior);
        } catch (e) {
            console.error(e);
        }
        this.image=new Image();
        this.image.src=character.imagePath; // with character images
    }

    update (currentTime:DOMHighResTimeStamp) {
        [this.positionX,this.positionY]=this.moveBehavior.move!(this.positionX,this.positionY);
        this.throwBehavior?.update(currentTime);
        this.offsetOfSprite += 1 ;
        if (this.offsetOfSprite >= 8)
            this.offsetOfSprite -= 8;
    }

    draw () {
        this.context.clearRect(0,0,800, 600);
        //this.context.drawImage(this.image,this.positionX,this.positionY);
        this.drawSprite(this.image,this.positionX,this.positionY, 8, Math.floor(this.offsetOfSprite));
        this.throwBehavior?.draw();
    }

    private drawSprite(sprite:HTMLImageElement,positionX:number, positionY:number, numberOfSingleImage:number, offsiteOfSprite:number) {
        const imageDisplayedScale =numberOfSingleImage/8;
        const singleImageWidth=sprite.width/8
        this.context.drawImage(sprite, singleImageWidth*offsiteOfSprite, 0, singleImageWidth, sprite.height, positionX, positionY, singleImageWidth*imageDisplayedScale, sprite.height*imageDisplayedScale);
    }
}

/**
 * Projectile Class that deals with ballistic
 */
 export class Projectile extends GameObject {

    xNextPosition!:number;
    yNextPosition!:number;
    xInitialSpeedVector!:number;
    yInitialSpeedVector!:number;
    birthTime:DOMHighResTimeStamp;
    thrownObjectImagePath!:string;
    reqId:number=0;
    step:number=0;
    ready:boolean=false;
    collisionDetection: boolean=true;

    constructor(positionX:number, positionY:number,
                xNextPosition:number, yNextPosition:number,
                xInitialSpeedVector:number, yInitialSpeedVector:number,
                thrownObjectImagePath:string,
                ) {
        super();
        this.birthTime=-1;
        this.name="projectile-"+Date.now().toString();
        console.log(this.name);
        this.zIndex="20";
        this.context=this.createContext();
        this.positionX=positionX;
        this.positionY=positionY;
        this.xNextPosition=xNextPosition;
        this.yNextPosition=yNextPosition;
        this.xInitialSpeedVector=xInitialSpeedVector;
        this.yInitialSpeedVector=yInitialSpeedVector;
        this.initialize(thrownObjectImagePath);
    }

    initialize(thrownObjectImagePath:string) {
        this.image = new Image();
        this.image.onload = () => {this.ready=true; console.log("INFO: fish image onload done")};
        this.thrownObjectImagePath = thrownObjectImagePath;
        this.image.src = thrownObjectImagePath;
        console.log(this.image + " - " + this.positionX  + " - " +  this.positionY)
//        this.context.imageSmoothingEnabled = false;
    }

    update (timeStamp:DOMHighResTimeStamp) {
        if (this.birthTime===-1) {
            this.birthTime=timeStamp;
        }
        let currentTime = (timeStamp-this.birthTime)/50;
        if (this.ready) {
            if (this.yNextPosition<-100 || this.yNextPosition>550 || this.xNextPosition>800 || this.xNextPosition<0) {
                this.ready=false;
                this.outOfGame=true;
            } else {
                this.positionX=this.xNextPosition;
                this.positionY=this.yNextPosition;
                this.xNextPosition=Math.round(this.xInitialSpeedVector*currentTime+this.positionX);
                this.yNextPosition=Math.round(5*currentTime*currentTime-this.yInitialSpeedVector*currentTime+this.positionY);
                console.log("t:"+currentTime+" x:"+this.xNextPosition+" y:"+this.yNextPosition+" oldx:"+this.positionX+" oldy:"+this.positionY)
                this.step += 1 ;
                if (this.step >= 8)
                    this.step -= 8;
            };
        }
    } 

    draw () {
        if (this.ready) {
            this.context.clearRect(0,0,800,600);
            //this.context.clearRect(this.xCurrentPosition-32,this.yCurrentPosition-32,64,64 );
            this.drawSprite(this.xNextPosition,this.yNextPosition, 2, Math.floor(this.step));
        }
    }

    private drawSprite(x:number, y:number, r:number, step:number) {
        var s =r/8;
        this.context.drawImage(this.image, 128*step, 0, 128, 128, x-64*s, y-64*s, 128*s, 128 *s);
    }
}
