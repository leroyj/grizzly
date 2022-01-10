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
        if ( (positionX<500) || (positionX>775) ) {
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

export const MoveBehaviorStore: any = {
    MoveNot,
    MoveRightLeft,
    MoveByBounce
}