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
        return [positionX-this.direction,positionY];
    }
}

export const MoveBehaviorStore: any = {
    MoveNot,
    MoveRightLeft
}