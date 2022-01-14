export interface MoveBehavior {
    move?(positionX:number,positionY:number):[number,number];
}

export class MoveNot implements MoveBehavior {
    move(positionX:number,positionY:number):[number,number] {
        //Nada
        return [positionX,positionY]
    }
}
export class MoveRightLeft implements MoveBehavior {
    direction:number=1;
    move(positionX:number,positionY:number):[number,number] {
        //console.log("MoveLeft.move called!");
        if ( (positionX<550) || (positionX>775) ) {
            this.direction*=-1;
        } 
        return [positionX-2*this.direction,positionY];
    }
}
export class MoveByBounce implements MoveBehavior {
    direction:number=1;
    range=0;
    move(positionX:number,positionY:number):[number,number] {
        //console.log("MoveLeft.move called!");
        if ( (this.range<0) || (this.range>11) ) {
            this.direction*=-1;
        }
        this.range+=this.direction;
        return [positionX,positionY+2*this.direction];
    }
}

export class MoveByBounceRightLeft implements MoveBehavior {
    directionX:number=1;
    rangeX=5;
    directionY:number=1;
    rangeY=3;
    move(positionX:number,positionY:number):[number,number] {
        //console.log("MoveLeft.move called!");
        if ( (this.rangeX<0) || (this.rangeX>61) ) {
            this.directionX*=-1;
        }
        this.rangeX+=this.directionX;
        if ( (this.rangeY<0) || (this.rangeY>11) ) {
            this.directionY*=-1;
        }
        this.rangeY+=this.directionY;
        return [positionX+Math.abs(this.directionX)*this.directionX,positionY+2*this.directionY];
    }
}

export class MoveFromRightToleft implements MoveBehavior {
    move(positionX:number,positionY:number):[number,number] {
        //console.log("MoveLeft.move called!");
        return [positionX-1,positionY];
    }
}

export class MoveFromTopToGround implements MoveBehavior {
    directionX:number=1;
    rangeX=0;
    move(positionX:number,positionY:number):[number,number] {
        if ( positionY < 500 ) {
            positionY+=0.5;
            if ( (this.rangeX<-1) || (this.rangeX>1) ) {
                this.directionX*=-1;
            }
            this.rangeX+=this.directionX*0.1;
            positionX+=this.rangeX;
        }
    //console.log("MoveLeft.move called!");
        return [positionX,positionY];
    }
}

export const MoveBehaviorStore: any = {
    MoveNot,
    MoveRightLeft,
    MoveByBounce,
    MoveByBounceRightLeft,
    MoveFromRightToleft,
    MoveFromTopToGround
}