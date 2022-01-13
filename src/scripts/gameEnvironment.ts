import { JsonLevel } from "./JsonLevelType";
import { Character } from "./characters";
import { ScoreBoard } from "./ScoreBoard"
import { Keyboarder } from "./Keyboarder";
import { GameEnv, GameObject } from "./GameObject";

export class GameEnvironment implements GameEnv{
  gameObjectList:GameObject[]=[];
  keyboarder:Keyboarder;
  private reqId:number=0;
  private scoreBoard:ScoreBoard;
  private levelCompleted:boolean;
  private levelEndSound:string;
  private remainingAmmunitions:number;
  private levelName:string;

  constructor(level:JsonLevel, score:ScoreBoard, keyboarder:Keyboarder) {
    this.levelCompleted=false;
    this.keyboarder=keyboarder?? (() => {throw new Error("ERROR: No keyboarder available")})();
    this.remainingAmmunitions=99;
    this.scoreBoard = score?? (() => {throw new Error("ERROR: No score available")})();
    this.levelName = level.levelName;
    score.setlevelName(level.levelName);
    score.setRemainingAmmunition(this.remainingAmmunitions);
    this.loadCharacters(level);
    this.loadCharactersImages();
    this.loadSound(level.levelSound);
    this.levelEndSound=level.levelEndSound;
  }

  private loadCharacters (level:JsonLevel) {
    console.log("[loadCharacters] start to load Characters...");
    level.characterList.forEach((character) => {
      console.log("[loadCharacters] current Character: "+character.name);
      const newCharacter:Character=new Character(character,this);
      console.debug("[loadCharacters] DEBUG GameEnvironment:");
      console.debug(this);
      this.gameObjectList.push(newCharacter);
    });
    console.log("[loadCharacters] Loaded "+this.gameObjectList.length+" Characters!");
  }

  private loadCharactersImages () {
    Promise.all<void>(this.gameObjectList.map( currentCharacter =>
    new Promise((resolve, reject) => {
      currentCharacter.image.onload = () => resolve();
      currentCharacter.image.onerror = reject;
      console.debug("image.src:"+currentCharacter.image.src);
    })
    )).then(this.waitForUserToStart.bind(this))
    .catch((error) => {console.error(error);}); //initialize as soon as all the images are loaded (asynchronous tasl)
  }

  private loadSound (levelSoundsrc:string){
    //play sound
    let sound      = document.createElement('audio');
    sound.id       = 'audio-player';
    sound.controls = true;
    sound.loop     = true;
    sound.src      = levelSoundsrc;
    document.getElementById('music-player')!.appendChild(sound);    
  }
  private loadEndSound (){
    var audio = new Audio(this.levelEndSound);
    audio.play();
  }

  private waitForUserToStart() {
    console.log("[waitForUserToStart]");
    console.log(this);
    this.scoreBoard.displayReadyToStart();
    this.draw(); 
    window.onkeypress = (event) => {
      if (event.key=="Enter") { 
        this.scoreBoard.resetMessageDisplayed();
        this.initialize();
        window.onkeypress=null;
      }
    };
  }

  private initialize () {
    //draw character image
    console.log("[initialize] Initialize animation loop")
    let startTime:DOMHighResTimeStamp=-1;
    let animate = (timestamp:DOMHighResTimeStamp) => {
      if ((startTime===-1)&&(startTime = timestamp)) {
        console.debug("[RAF] InitiateReqAnimFrame with ReqID "+this.reqId+" on startTime:"+startTime.toString()+" TimeStamp: "+timestamp);
        this.reqId = requestAnimationFrame(animate);
      } else {
        let currentTime = timestamp - startTime;
        if (!(this.keyboarder.keyState.ESCAPE)&&!(this.levelCompleted)) {
          // Update game state.
          this.update(currentTime);
          // Draw game bodies.
          this.draw();    
          // Queue up the next call to tick with the browser.
          this.reqId = requestAnimationFrame(animate);
        } else {
          console.log(this.keyboarder.keyState);
          console.log("[RAF] Cancelled animation loop by ESCAPE: "+this.keyboarder.keyState.ESCAPE);
          console.log("[RAF] Cancelled animation loop by levelCompleted: "+this.levelCompleted);
          console.log("[RAF] ReqId (inside the RAF): "+this.reqId);
          window.cancelAnimationFrame(this.reqId);
          this.scoreBoard.displayLevelCompleted();
          const event = new CustomEvent('nextLevel', { detail: this.levelName });
          const gameElement:Element = document.getElementById('game') ?? (() => {throw new Error("ERROR: No game Element in HTML page")})();
          gameElement.dispatchEvent(event);      
        }
      }
    }
    this.reqId = requestAnimationFrame(animate);
  }

  private update(currentTime:DOMHighResTimeStamp) {
    this.gameObjectList.forEach((currentObject) =>
    {
      currentObject.update(currentTime);
    });

  }

  private draw() {
    this.gameObjectList.forEach((currentObject) =>
    {
      currentObject.draw();
    })
    this.scoreBoard.draw();
  }

  addGameObjectToList(gameObject:GameObject) {
      this.gameObjectList.push(gameObject); 
      this.cleanUpObjectList();
  };

  private cleanUpObjectList () {
    const lengthBeforeCleanUp:number=this.gameObjectList.length;
    this.gameObjectList=this.gameObjectList.filter(currentObject => currentObject.outOfGame === false);
    const lengthAfterCleanUp:number=this.gameObjectList.length;
    console.log("[cleanUpObjectList] ObjectList length after cleaning: "+lengthAfterCleanUp+ "("+(lengthBeforeCleanUp-lengthAfterCleanUp)+" deleted)");
  }

  getKeyboarder ():Keyboarder {
      return this.keyboarder;
  }

  levelcompleted(): void {
    console.log("End Of Level!")
    this.levelCompleted=true;
    console.log("ReqId: "+this.reqId);
    this.scoreBoard.displayLevelCompleted();
    this.loadEndSound();
    // this.keyboarder.destructor();
  }

  setremainingAmmunitions(remainingAmmunitions: number): void {
      this.remainingAmmunitions=remainingAmmunitions;
      this.scoreBoard.setRemainingAmmunition(remainingAmmunitions);
  }
/*   reinitialize() {
    grizzlyArm.initialize(50,400,70,15);
    score.initialize(0);
    grizzlyArm.draw();
  }*/
}
