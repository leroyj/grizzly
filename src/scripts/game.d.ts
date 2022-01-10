export type JsonCharacter = {
    "name": string;
    "zIndex": string;
    "imagePath": string;
    "positionX": number;
    "positionY": number;
    "moveBehavior": string;
    "arm": boolean;
    "armAngle": number;
    "armPower": number;
}

export type JsonLevel = {
    "levelLandscapeImage": string;
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