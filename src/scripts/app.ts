import { GameEnvironment } from './gameEnvironment';
import { GrizzlyArm, Character, Score } from "./characters";

function reinitialize() {
  grizzlyArm.initialize(50,400,70,15);
  score.initialize(0);
  grizzlyArm.draw();
}

const uiCanvas = <HTMLCanvasElement>document.getElementById('ui-layer');
const uiCtx = uiCanvas.getContext('2d') ?? (() => {throw new Error("ERROR: No ui context")})();
const gameCanvas = <HTMLCanvasElement>document.getElementById('game-layer')
const gameCtx = gameCanvas.getContext('2d') ?? (() => {throw new Error("ERROR: No game context")})();
const bkgCanvas = <HTMLCanvasElement>document.getElementById('background-layer')
const bkgdCtx = bkgCanvas.getContext('2d') ?? (() => {throw new Error("ERROR: No background context")})();

const grizzly = new Character(bkgdCtx,"../assets/bear.svg",30,350);
grizzly.imagePath;
const lemming = new Character(bkgdCtx,"../assets/lemmings.svg",700,400);
lemming.imagePath;
const grizzlyArm = new GrizzlyArm (gameCtx,50,400,70,15);
const score = new Score(uiCtx,0);
const gameEnvironment= new GameEnvironment(bkgdCtx);

gameEnvironment.drawBackground();
  score.draw();
grizzlyArm.draw();

window.addEventListener("keydown", function (event) {
  if (event.defaultPrevented) {
    return; // Do nothing if the event was already processed
  }
  switch (event.key) {
    case "Down": // IE/Edge specific value
    case "ArrowDown":
      grizzlyArm.lower();
      console.log("ArrowDown: lower");
      break;
    case "Up": // IE/Edge specific value
    case "ArrowUp":
      grizzlyArm.higher();
      console.log("ArrowUp: lift");
      break;
    case "Left": // IE/Edge specific value
    case "ArrowLeft":
      grizzlyArm.powerDown();
      console.log("ArrowLeft: speedDown");
      break;
    case "Right": // IE/Edge specific value
    case "ArrowRight":
      grizzlyArm.powerUp();
      console.log("ArrowRight: speedDown");
      break;
    case " ":
      grizzlyArm.throwProjectile();
      console.log(" : launch");
      break;
    case "Esc": // IE/Edge specific value
    case "Escape":
      reinitialize();
      console.log("Escape: reinitialize");
      break;
    default:
      return; // Quit when this doesn't handle the key event.
  }
  // Cancel the default action to avoid it being handled twice
  event.preventDefault();
}, true);
