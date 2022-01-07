import fishUrl from '../assets/fish.png';

export class Character {
    /**
    * xPosition  x position of the character picture on the Canvas
    */
    xPosition!:number;
    /**
    *  yPosition  y position of the character picture on the Canvas
    */
    yPosition!:number;
    /**
    *  image  character picture to render on the Canvas
    */
    image!:HTMLImageElement;
    imagePath!:string;
    context!:CanvasRenderingContext2D;

    constructor (context:CanvasRenderingContext2D, imagePath:string,
                xPosition:number, yPosition:number) {
        this.initialize(context, xPosition, yPosition, imagePath);
    }

    initialize (context:CanvasRenderingContext2D,xPosition:number, yPosition:number, imagePath:string) {
        this.xPosition=xPosition;
        this.yPosition=yPosition;
        this.imagePath=imagePath;
        this.context=context
        this.image = new Image();
        this.image.src = imagePath;
        console.log(this.image + " - " + this.xPosition  + " - " +  this.yPosition)
        this.draw = () => {
            console.log("This is inside:" + this);
            console.log(this.image + " - " + this.xPosition  + " - " +  this.yPosition)
            this.context.drawImage(this.image, this.xPosition, this.yPosition);    
        }
        this.image.onload = this.draw;
    }

    draw () {
        console.log("This is :" + this);
        console.log(this.image + " - " + this.xPosition  + " - " +  this.yPosition)
        this.context.drawImage(this.image, this.xPosition, this.yPosition);
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
 
     constructor (public context:CanvasRenderingContext2D,
                xPosition:number, yPosition:number, 
                Angle:number, Power:number
        ) {
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
     draw() {
        this.computeSpeedVector();
        this.context.clearRect(0,0,800, 600);
        this.context.save();
        console.log("draw vector");
        this.context.beginPath();
        this.context.strokeStyle = 'black';
        this.context.moveTo(this.xPosition, this.yPosition);
        this.context.lineTo(50+this.xInitialSpeedVector,400-this.yInitialSpeedVector);
        this.context.lineTo(50+this.xInitialSpeedVector-5,400-this.yInitialSpeedVector);
        this.context.stroke();
        this.context.restore();
    }

    higher() {
        if (this.Angle < 120) {
            this.Angle+=4;
            this.draw();
        }
      }
      
    lower() {
        if (this.Angle > 10) {
            this.Angle-=4;
            this.draw();
        }
      }
      
    powerUp() {
        if (this.Power < 18) {
            this.Power++;
          this.draw();
        }
      }
      
    powerDown() {
        if (this.Power > 8) {
            this.Power--;
          this.draw();
        }
      }
    
    throwProjectile() {
        return new Projectile (this.context,
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
    context!:CanvasRenderingContext2D;
    reqId:number=0;
    step:number=0;

    constructor(context:CanvasRenderingContext2D,
                xCurrentPosition:number, yCurrentPosition:number,
                xNextPosition:number, yNextPostition:number,
                xInitialSpeedVector:number, yInitialSpeedVector:number,
                timestep:number
                ) {
        this.initialize(context,xCurrentPosition,yCurrentPosition,
                        xNextPosition,yNextPostition,
                        xInitialSpeedVector,yInitialSpeedVector,
                        timestep);
    }

    initialize(context:CanvasRenderingContext2D,xCurrentPosition:number, yCurrentPosition:number,
            xNextPosition:number, yNextPosition:number,
            xInitialSpeedVector:number, yInitialSpeedVector:number,
            timestep:number) {
        this.context=context;
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
        this.animate = () => {
            this.draw();
            this.update();
            if (this.yNextPosition<-100 || this.yNextPosition>500 || this.xNextPosition>800 || this.xNextPosition<0) {
                window.cancelAnimationFrame(this.reqId);
                this.draw();
            } else {
                this.reqId=requestAnimationFrame(this.animate);
            }
        }
        this.sprite.onload = this.animate;
        this.context.imageSmoothingEnabled = false;
        this.context.moveTo(this.xCurrentPosition,this.yCurrentPosition);
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

    draw () {
        this.context.clearRect(this.xCurrentPosition-32,this.yCurrentPosition-32,64,64 );
        this.drawProjectile(this.xNextPosition,this.yNextPosition, 2, Math.floor(this.step));
    }

    drawProjectile(x:number, y:number, r:number, step:number) {
        var s =r/8;
        this.context.drawImage(this.sprite, 128*step, 0, 128, 128, x-64*s, y-64*s, 128*s, 128 *s);
    }

     animate() {
/*         this.draw();
        this.update();
        if (this.yNextPosition<-100 || this.yNextPosition>400 || this.xNextPosition>800 || this.xNextPosition<0) {
            window.cancelAnimationFrame(this.reqId);
        } else {
            this.reqId=requestAnimationFrame(this.animate);
        } */
    }
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