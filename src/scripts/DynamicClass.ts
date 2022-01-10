
import { MoveBehaviorStore } from "./MoveBehavior";

export class DynamicClass {
    constructor(className: string, opts: any) {
        if (MoveBehaviorStore[className] === undefined || MoveBehaviorStore[className] === null) {
            throw new Error(`Class type of \'${className}\' is not in the store`);
        }
        return new MoveBehaviorStore[className](opts);
    }
}