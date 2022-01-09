import { JsonLevel } from "./game";
//import { GrizzlyArm, Character, Score } from "./characters";
import { Character, Score } from "./characters";
import { Keyboarder } from "./keyboarder";

export class GameEnvironment {
  // context: CanvasRenderingContext2D;
  characterList:Character[]=[];
  levelLandscapeImage!:HTMLImageElement;
  keyboarder:Keyboarder;
  reqId:number=0;
  projectileCtx:CanvasRenderingContext2D;
  uiCtx:CanvasRenderingContext2D;
  score:Score;
  

  constructor(level:JsonLevel) {
    this.loadCharacters(level);
    this.loadLandscapeImages(level.levelLandscapeImage);
    this.keyboarder = new Keyboarder();
    this.loadCharactersImages();
    this.loadSound(level.levelSound);
    const projectileCanvas = <HTMLCanvasElement>document.getElementById('projectile-layer');
    this.projectileCtx = projectileCanvas.getContext('2d') ?? (() => {throw new Error("ERROR: No game context")})();
    const uiCanvas = <HTMLCanvasElement>document.getElementById('ui-layer');
    this.uiCtx = uiCanvas.getContext('2d') ?? (() => {throw new Error("ERROR: No ui context")})();
    this.score = new Score(0);
  }

  loadCharacters (level:JsonLevel) {
    level.characterList.forEach((character) => {
      this.characterList.push(Object.assign(new Character(character),character));
    });
  }

  loadLandscapeImages (levelLandscapeImageSrc:string) {
    this.levelLandscapeImage = new Image();
    this.levelLandscapeImage.src = levelLandscapeImageSrc;
    new Promise<HTMLImageElement>((resolve, reject) => {
      this.levelLandscapeImage.onload = () => resolve(this.levelLandscapeImage);
      this.levelLandscapeImage.onerror = reject;
    }).then(this.initializeLandscape.bind(this)); //initialize as soon as all the images are loaded (asynchronous tasl)
  }

  loadCharactersImages () {
    this.characterList.forEach((character) => {
      character.image=new Image();
      character.image.src=character.imagePath; // with character images
    });

    Promise.all<void>(this.characterList.map( currentCharacter =>
    new Promise((resolve, reject) => {
      currentCharacter.image.onload = () => resolve();
      currentCharacter.image.onerror = reject;
      console.log("image.src:"+currentCharacter.image.src);
    })
    )).then(this.initialize.bind(this))
    .catch((error) => {console.error(error);}); //initialize as soon as all the images are loaded (asynchronous tasl)
  }

  initializeLandscape (image:HTMLImageElement) {
    //draw background image
    const bkgCanvas = <HTMLCanvasElement>document.getElementById('background-layer');
    const bkgdCtx = bkgCanvas.getContext('2d') ?? (() => {throw new Error("ERROR: No background context")})();
    const imageToDraw = image ?? (() => {throw new Error("ERROR: no images to initialize")});
    bkgdCtx.drawImage(imageToDraw, 0, 0);
  }

  initialize () {
    //draw character image
    const gameCanvas = <HTMLCanvasElement>document.getElementById('game-layer');
    let gameSize = { x: gameCanvas.width, y: gameCanvas.height }
    const gameCtx = gameCanvas.getContext('2d') ?? (() => {throw new Error("ERROR: No game context")})();

    let animate = () => {
      // Draw game bodies.
      this.draw(gameCtx, gameSize);
    
      // Update game state.
      this.update();
    
      // Queue up the next call to tick with the browser.
      if (this.keyboarder.keyState.ESCAPE) {
        window.cancelAnimationFrame(this.reqId);
        this.draw(gameCtx, gameSize);
      } else {
        this.reqId = requestAnimationFrame(animate);
      }
    }
    animate();
    /*     animate() {
        this.draw(context);
        this.update();
        if (this.yNextPosition<-100 || this.yNextPosition>400 || this.xNextPosition>800 || this.xNextPosition<0) {
            window.cancelAnimationFrame(this.reqId);
            this.draw(context);
        } else {
            this.reqId=requestAnimationFrame(this.animate);
        } 
    } */
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
      currentCharacter.update(this.keyboarder);
    });

  }

  draw(gameCtx:CanvasRenderingContext2D,gameSize:{x:number,y:number}) {
    const projectileCtx = this.projectileCtx;
    this.characterList.forEach((currentCharacter) =>
    {
      currentCharacter.draw(gameCtx);
      currentCharacter.armObject?.projectile?.draw(projectileCtx);
      gameSize;
    });
    this.score.draw(this.uiCtx);
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


