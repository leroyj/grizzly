import { JsonLevel } from "./game";
//import { GrizzlyArm, Character, Score } from "./characters";
import { Character } from "./characters";
import { Score } from "./score"
import { Keyboarder } from "./Keyboarder";

export class GameEnvironment {
  characterList:Character[]=[];
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
      const newCharacter:Character=new Character(character,this.keyboarder);
      this.characterList.push(newCharacter);
    });
    console.log("Loaded Character: "+this.characterList.length);
  }

  loadCharactersImages () {
    Promise.all<void>(this.characterList.map( currentCharacter =>
    new Promise((resolve, reject) => {
      currentCharacter.image.onload = () => resolve();
      currentCharacter.image.onerror = reject;
      console.log("image.src:"+currentCharacter.image.src);
    })
    )).then(this.initialize.bind(this))
    .catch((error) => {console.error(error);}); //initialize as soon as all the images are loaded (asynchronous tasl)
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
    this.characterList.forEach((currentCharacter) =>
    {
      currentCharacter.update();
    });

  }

  draw() {
    this.characterList.forEach((currentCharacter) =>
    {
      currentCharacter.draw();
      currentCharacter.armObject?.projectile.forEach((currentProjectile) => {
        currentProjectile.draw();
      });
    this.score.draw();
    })
  }

/*   reinitialize() {
    grizzlyArm.initialize(50,400,70,15);
    score.initialize(0);
    grizzlyArm.draw();
  }

const grizzlyArm = new GrizzlyArm (gameCtx,50,400,70,15);
const score = new Score(uiCtx,0);

score.draw();
grizzlyArm.draw();
 */

}


