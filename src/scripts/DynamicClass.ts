import { GameEnv, GameObject } from "./GameObject";
import { MoveBehaviorStore } from "./MoveBehavior";
import { ThrowBehaviorStore } from "./ThrowBehavior";

export class MoveDynamicClass {
    constructor(className: string, opts: any) {
        if (MoveBehaviorStore[className] === undefined || MoveBehaviorStore[className] === null) {
            throw new Error(`Class type of \'${className}\' is not in the store`);
        }
        return new MoveBehaviorStore[className](opts);
    }
}

export class ThrowDynamicClass extends GameObject {
    constructor(className: string, positionX:number, positionY:number, 
        Angle:number, Power:number,
        thrownObjectImagePath:string,
        gameEnv:GameEnv) {
        super();
        if (ThrowBehaviorStore[className] === undefined || ThrowBehaviorStore[className] === null) {
            throw new Error(`Class type of \'${className}\' is not in the store`);
        }
        return new ThrowBehaviorStore[className](positionX, positionY, 
            Angle, Power,
            thrownObjectImagePath,
            gameEnv);
    }
    update (){
        
    }
    draw (){

    }
}