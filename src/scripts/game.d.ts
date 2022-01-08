export type JsonCharacter = {
    "name": string;
    "imagePath": string;
    "positionX": number;
    "positionY": number;
    "arm": boolean;
    "armAngle": number;
    "armPower": number;
}

export type JsonLevel = {
    "levelLandscapeImage": string;
    "levelSound": string;
    "characterList": JsonCharacter[];
}