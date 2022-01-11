import { JsonLevel } from "./game";
import { Character } from "./characters";
import { Score } from "./score"
import { Keyboarder } from "./Keyboarder";
import { GameEnv, GameObject } from "./GameObject";

export class GameEnvironment implements GameEnv{
  gameObjectList:GameObject[]=[];
  keyboarder:Keyboarder;
  reqId:number=0;
  score:Score;

  constructor(level:JsonLevel, score:Score, keyboarder:Keyboarder) {
    this.keyboarder=keyboarder?? (() => {throw new Error("ERROR: No keyboarder available")})();
    this.loadCharacters(level);
    this.loadCharactersImages();
    this.loadSound(level.levelSound);
    this.score = score;
  }

  loadCharacters (level:JsonLevel) {
    level.characterList.forEach((character) => {
      const newCharacter:Character=new Character(character,this);
      this.gameObjectList.push(newCharacter);
    });
    console.log("Loaded Character: "+this.gameObjectList.length);
  }

  loadCharactersImages () {
    Promise.all<void>(this.gameObjectList.map( currentCharacter =>
    new Promise((resolve, reject) => {
      currentCharacter.image.onload = () => resolve();
      currentCharacter.image.onerror = reject;
      console.log("image.src:"+currentCharacter.image.src);
    })
    )).then(this.waitForUserToStart.bind(this))
    .catch((error) => {console.error(error);}); //initialize as soon as all the images are loaded (asynchronous tasl)
  }

  waitForUserToStart() {
    this.draw(); 
    this.score.addMessage("Press ⏎ to start!");
    window.onkeypress = (event) => {
      if (event.key=="Enter") { 
        this.initialize();
        window.onkeypress=null;
      }
    };
  }

  initialize () {
    //draw character image
    let animate = () => {
      // Draw game bodies.
      this.draw();    
      // Update game state.
      this.update();
      // Queue up the next call to tick with the browser.
      if (this.keyboarder.keyState.ESCAPE) {
        window.cancelAnimationFrame(this.reqId);
        this.draw();
      } else {
        this.reqId = requestAnimationFrame(animate);
      }
    }
    animate();
  }

  loadSound (levelSoundsrc:string){
    //play sound
    let sound      = document.createElement('audio');
    sound.id       = 'audio-player';
    sound.controls = true;
    sound.loop     = true;
    sound.src      = levelSoundsrc;
    document.getElementById('music-player')!.appendChild(sound);    
  }

  update() {
    this.gameObjectList.forEach((currentCharacter) =>
    {
      currentCharacter.update();
    });

  }

  draw() {
    this.gameObjectList.forEach((currentCharacter) =>
    {
      currentCharacter.draw();
      this.score.draw();
    })
  }

addGameObjectToList(gameObject:GameObject) {
    this.gameObjectList.push(gameObject); 
    this.score.projectileCountdown();
    this.cleanUpObjectList();
 };

 cleanUpObjectList () {
  console.log("ObjectList length before cleaning: "+this.gameObjectList.length);
  this.gameObjectList=this.gameObjectList.filter(currentObject => currentObject.outOfGame === false)
  console.log("ObjectList length after cleaning: "+this.gameObjectList.length);
 };

 getKeyboarder ():Keyboarder {
     return this.keyboarder;
 }
/*   reinitialize() {
    grizzlyArm.initialize(50,400,70,15);
    score.initialize(0);
    grizzlyArm.draw();
  }*/
}


