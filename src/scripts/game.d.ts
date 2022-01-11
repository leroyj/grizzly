export type JsonCharacter = {
    "name": string;
    "zIndex": string;
    "imagePath": string;
    "positionX": number;
    "positionY": number;
    "moveBehavior": string;
    "throwBehavior": string;
    "throwAngle": number;
    "throwPower": number;
    "thrownObjectImagePath": string;
}

export type JsonLevel = {
    "levelSound": string;
    "characterList": JsonCharacter[];
}

export type KeyState = {
    DOWN: boolean;
    UP:boolean;
    LEFT:boolean;
    RIGHT:boolean;
    SPACE:boolean;
    ESCAPE:boolean;
  };