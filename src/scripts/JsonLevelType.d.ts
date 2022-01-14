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
    "throwAmmunition": number;
    "collisionDetection": boolean;
    "pointsToScore": number;
}

export type JsonLevel = {
    "levelName": string;
    "levelSound": string;
    "levelEndSound": string;
    "characterList": JsonCharacter[];
}
