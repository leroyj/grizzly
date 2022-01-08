import { JsonCharacter } from "./game";
import fishUrl from '../assets/fish.png';
import { Keyboarder } from "./keyboarder"

export class Character {
    name:string;
    imagePath:string;
    /**
    * xPosition  x position of the character picture on the Canvas
    */
    positionX:number;
    /**
    *  yPosition  y position of the character picture on the Canvas
    */
    positionY:number;
    /**
    *  image  character picture to render on the Canvas
    */
    armObject:GrizzlyArm|null;

    image!:HTMLImageElement; //TOFIX: type


    constructor (character:JsonCharacter) {
        this.name=character.name;
        this.imagePath=character.imagePath;
        this.positionX=character.positionX;
        this.positionY=character.positionY;
        if (character.arm) {
            this.armObject=new GrizzlyArm(this.positionX, this.positionY+100, character.armAngle, character.armPower);
            console.log("arm created");
            console.log(this.armObject);
        } else {
            this.armObject=null;
        }
    }

    update (keyboarder:Keyboarder) {
        this.armObject?.update(keyboarder);
    }

    draw (context:CanvasRenderingContext2D) {
//        console.log(this.image);
        context.drawImage(this.image,this.positionX,this.positionY);
        this.armObject?.draw(context);
    }

}

export class GrizzlyArm {
    /**
    *  xArmPosition  x position of the arm 
    */
     xPosition!:number; 
    /**
    *  yArmPosition  x position of the arm 
    */
     yPosition!:number; 
    /**
    *  armAngle  Angle in degree of initial speed vector of the projectile when thrown 
    */
     Angle!:number; 
     /**
     *  armPower  Norm of initial speed vector of the projectile when thrown
     */
     Power!:number; 
    /**
    *  xSpeedVector  x position of the arm 
    */
     xInitialSpeedVector!:number; 
    /**
    *  ySpeedVector  y position of the arm 
    */
    yInitialSpeedVector!:number;

    projectile:Projectile|null=null;
 
    constructor (xPosition:number, yPosition:number, 
                Angle:number, Power:number) {
        this.initialize(xPosition, yPosition, Angle, Power);
        this.computeSpeedVector();
     }

     initialize (xPosition:number, yPosition:number, 
                Angle:number,Power:number) {
        this.xPosition=xPosition;
        this.yPosition=yPosition;
        this.Angle=Angle;
        this.Power=Power;
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
        //context.clearRect(0,0,800, 600);
        context.save();
        context.beginPath();
        context.strokeStyle = 'black';
        context.moveTo(this.xPosition, this.yPosition);
        context.lineTo(50+this.xInitialSpeedVector,400-this.yInitialSpeedVector);
        context.lineTo(50+this.xInitialSpeedVector-5,400-this.yInitialSpeedVector);
        context.stroke();
        context.restore();
        this.projectile?.draw(context);
    }

    update(keyboarder:Keyboarder) {
        keyboarder.keyState.DOWN && this.lower();        
        keyboarder.keyState.UP && this.higher();
        keyboarder.keyState.LEFT && this.powerDown();
        keyboarder.keyState.RIGHT && this.powerUp();
        keyboarder.keyState.SPACE && this.throwProjectile();
        this.projectile?.update();
    }

    higher() {
        if (this.Angle < 120) {
            this.Angle+=4;
        }
      }
      
    lower() {
        if (this.Angle > 10) {
            this.Angle-=4;
        }
      }
      
    powerUp() {
        if (this.Power < 18) {
            this.Power++;
        }
      }
      
    powerDown() {
        if (this.Power > 8) {
            this.Power--;
        }
      }
    
    throwProjectile() {
        this.projectile = new Projectile (
                                this.xPosition, this.yPosition,
                                this.xPosition, this.yPosition,
                                this.xInitialSpeedVector, this.yInitialSpeedVector,
                                0
            );
    }

}

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
    //context!:CanvasRenderingContext2D;
    reqId:number=0;
    step:number=0;

    constructor(xCurrentPosition:number, yCurrentPosition:number,
                xNextPosition:number, yNextPostition:number,
                xInitialSpeedVector:number, yInitialSpeedVector:number,
                timestep:number
                ) {
        this.initialize(xCurrentPosition,yCurrentPosition,
                        xNextPosition,yNextPostition,
                        xInitialSpeedVector,yInitialSpeedVector,
                        timestep);
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
        this.sprite.onload = () => {};
//        this.sprite.onload = this.animate.bind(this);
//        this.context.imageSmoothingEnabled = false;
//        this.context.moveTo(this.xCurrentPosition,this.yCurrentPosition);
    }

    update () {
        this.xCurrentPosition=this.xNextPosition;
        this.yCurrentPosition=this.yNextPosition;
        this.xNextPosition=Math.round(this.xInitialSpeedVector*this.timestep+this.xCurrentPosition);
        this.yNextPosition=Math.round(5*this.timestep*this.timestep-this.yInitialSpeedVector*this.timestep+this.yCurrentPosition);
        console.log("t:"+this.timestep+" x:"+this.xNextPosition+" y:"+this.yNextPosition+" oldx:"+this.xCurrentPosition+" oldy:"+this.yCurrentPosition)
        this.timestep+=0.1;
        this.step += 0.3 ;
        if (this.step >= 8)
            this.step -= 8;
    } 

    draw (context:CanvasRenderingContext2D) {
        context.clearRect(this.xCurrentPosition-32,this.yCurrentPosition-32,64,64 );
        this.drawProjectile(context,this.xNextPosition,this.yNextPosition, 2, Math.floor(this.step));
    }

    drawProjectile(context:CanvasRenderingContext2D,x:number, y:number, r:number, step:number) {
        var s =r/8;
        context.drawImage(this.sprite, 128*step, 0, 128, 128, x-64*s, y-64*s, 128*s, 128 *s);
    }

/*     animate() {
        this.draw(context);
        this.update();
        if (this.yNextPosition<-100 || this.yNextPosition>400 || this.xNextPosition>800 || this.xNextPosition<0) {
            window.cancelAnimationFrame(this.reqId);
            this.draw(context);
        } else {
            this.reqId=requestAnimationFrame(this.animate);
        } 
    } */
}

export class Score {
    score!:number;

    constructor(public context:CanvasRenderingContext2D, score:number){
        this.initialize(score);
    }

    initialize (score:number) {
        this.score=score;
    }

    up(points:number) {
        this.score+=points;
    }

    draw() {
        this.context.font = '48px sans-serif';
        this.context.strokeText(this.score.toString(), 20, 60);
      };    
}