import { JsonLevel } from "./JsonLevelType";
import { Character } from "./Characters";
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
    sound.autoplay = true;
    sound.loop     = true;
    sound.volume = 0.5;
    sound.src      = levelSoundsrc;
    document.getElementById('music-player')!.appendChild(sound);    
  }

  private stopSound () {
    let sound=document.getElementById('audio-player') as HTMLAudioElement?? (() => {throw new Error("ERROR: No audio-player available")})();
    sound.pause();
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
    let animate = (timestamp:DOMHighResTimeStamp) => {
      const elapsedTime=timestamp-then;
      if (!(this.keyboarder.keyState.ESCAPE)&&!(this.levelCompleted)) {
        let currentTime = timestamp - startTime;
        // Queue up the next call to tick with the browser.
          this.reqId = requestAnimationFrame(animate);
        if (elapsedTime>fpsInterval) {
          then = timestamp - (elapsedTime%fpsInterval);
          // Update game state.
          this.update(currentTime);
          // Draw game bodies.
          this.draw();
        } else {
          //console.debug("ElapsedTime: "+elapsedTime +" and fpsInterval"+fpsInterval)
        }
      } else {
        console.log(this.keyboarder.keyState);
        console.log("[RAF] Cancelled animation loop by ESCAPE: "+this.keyboarder.keyState.ESCAPE);
        console.log("[RAF] Cancelled animation loop by levelCompleted: "+this.levelCompleted);
        console.log("[RAF] ReqId (inside the RAF): "+this.reqId);
        window.cancelAnimationFrame(this.reqId);
        this.scoreBoard.displayLevelCompleted();
        this.stopSound();
        this.loadEndSound();
        const event = new CustomEvent('nextLevel', { detail: this.levelName });
        const gameElement:Element = document.getElementById('game') ?? (() => {throw new Error("ERROR: No game Element in HTML page")})();
        gameElement.dispatchEvent(event);      
      }
    }
    const fps:number=40;
    const fpsInterval:number=1000/fps;
    let startTime=window.performance.now();
    let then = startTime;
    console.log("startTime: "+startTime+" fps:"+fps+" fpsinterval: "+fpsInterval)

    this.reqId = requestAnimationFrame(animate);
  }

  private update(currentTime:DOMHighResTimeStamp) {
    const projectileList:GameObject[]=[];
    const characterList:Character[]=[];
    this.gameObjectList.forEach((currentObject) => {
      currentObject.update(currentTime);
      //console.log("CURRENTOBJECTNAME: "+currentObject.name)
      if (currentObject.name.includes("projectile-")) {
        projectileList.push(currentObject);
        //console.log ("PROJECTILE: "+currentObject.name);
      } else {
        characterList.push(currentObject as Character);
      }
    });
    if (projectileList.length) {
      console.log("BEFORE DETECTION");
      projectileList.forEach((currentProjectile) => {
        characterList.forEach((currentCharacter) => {
          if (this.isColliding(currentProjectile,currentCharacter)) {
            console.log("[COLLISION DETECTION]");
            console.log(currentProjectile);
            console.log(currentCharacter);
            this.scoreBoard.addPoints(currentCharacter.pointsToScore);
            currentProjectile.outOfGame=true;
            currentProjectile.wipeCanvas();
            currentCharacter.outOfGame=true;
            currentCharacter.wipeCanvas();
            this.cleanUpObjectList();
            console.log(this.gameObjectList);
          }
        });
      });
    }

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
  }

  setremainingAmmunitions(remainingAmmunitions: number): void {
      this.remainingAmmunitions=remainingAmmunitions;
      this.scoreBoard.setRemainingAmmunition(remainingAmmunitions);
  }

  isColliding (gameObject1:GameObject, gameObject2:GameObject) {
    return (
      gameObject2.collisionDetection && (
        gameObject1.positionX < gameObject2.positionX + gameObject2.image.width/8 &&
        gameObject1.positionX + gameObject1.image.width/8 > gameObject2.positionX &&
        gameObject1.positionY < gameObject2.positionY + gameObject2.image.height &&
        gameObject1.image.height + gameObject1.positionY > gameObject2.positionY
      )
  
    )
  }
}
