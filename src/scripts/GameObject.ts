import { Keyboarder } from "./Keyboarder";

export abstract class GameObject {
    name:string="";
    zIndex:string="";
    image!:HTMLImageElement;
//    abstract initialize():void;
    abstract update():void;
    abstract draw():void;
    //FIXME: avoid to deactivate the ts checker
    //@ts-ignore
    createContext():CanvasRenderingContext2D {
        const canvas = document.createElement('canvas');
        canvas.id = this.name;
        canvas.width = 800;
        canvas.height = 600;
        canvas.style.zIndex = this.zIndex;
        canvas.style.position = "absolute";
        canvas.style.outline = "rgb(70, 35, 7) 20px outset";
        const gameElement:Element = document.getElementById('game') ?? (() => {throw new Error("ERROR: No game Element in HTML page")})();
        gameElement.appendChild(canvas);
        return canvas.getContext('2d') ?? (() => {throw new Error("ERROR: No background context")})();
    };
}

export interface GameEnv {
    gameObjectList:GameObject[];
    keyboarder:Keyboarder;
    addGameObjectToList(gameObject:GameObject):void;
    getKeyboarder ():Keyboarder;
}