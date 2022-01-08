export type KeyState = {
    DOWN: boolean;
    UP:boolean;
    LEFT:boolean;
    RIGHT:boolean;
    SPACE:boolean;
    ESCAPE:boolean;
  };
export class Keyboarder {
    keyState:KeyState= {
      DOWN:false,
      UP:false,
      LEFT:false,
      RIGHT:false,
      SPACE:false,
      ESCAPE:false
    };
    constructor () {
      window.addEventListener("keydown", (event) => {
        if (event.defaultPrevented) {
          return; // Do nothing if the event was already processed
        }
        switch (event.key) {
          case "Down": // IE/Edge specific value
          case "ArrowDown":
            this.keyState.DOWN=true;
            //grizzlyArm.lower();
            console.log("ArrowDown: lower");
            break;
          case "Up": // IE/Edge specific value
          case "ArrowUp":
            this.keyState.UP=true;
            //grizzlyArm.higher();
            console.log("ArrowUp: lift");
            break;
          case "Left": // IE/Edge specific value
          case "ArrowLeft":
            this.keyState.LEFT=true;
            //grizzlyArm.powerDown();
            console.log("ArrowLeft: speedDown");
            break;
          case "Right": // IE/Edge specific value
          case "ArrowRight":
            this.keyState.RIGHT=true;
            //grizzlyArm.powerUp();
            console.log("ArrowRight: speedDown");
            break;
          case " ":
            this.keyState.SPACE=true;
            //grizzlyArm.throwProjectile();
            console.log(" : launch");
            break;
          case "Esc": // IE/Edge specific value
          case "Escape":
            this.keyState.ESCAPE=true;
            //reinitialize();
            console.log("Escape: reinitialize");
            break;
          default:
            return; // Quit when this doesn't handle the key event.
        }
        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
      }, true);
  
      /* key up*/
      window.addEventListener("keyup", (event) => {
        if (event.defaultPrevented) {
          return; // Do nothing if the event was already processed
        }
        switch (event.key) {
          case "Down": // IE/Edge specific value
          case "ArrowDown":
            this.keyState.DOWN=false;
            console.log("ArrowDown released");
            break;
          case "Up": // IE/Edge specific value
          case "ArrowUp":
            this.keyState.UP=false;
            console.log("ArrowUp released");
            break;
          case "Left": // IE/Edge specific value
          case "ArrowLeft":
            this.keyState.LEFT=false;
            console.log("ArrowLeft released");
            break;
          case "Right": // IE/Edge specific value
          case "ArrowRight":
            this.keyState.RIGHT=false;
            console.log("ArrowRight released");
            break;
          case " ":
            this.keyState.SPACE=false;
            console.log(" released");
            break;
          case "Esc": // IE/Edge specific value
          case "Escape":
            this.keyState.ESCAPE=false;
            console.log("Escape released");
            break;
          default:
            return; // Quit when this doesn't handle the key event.
        }
        // Cancel the default action to avoid it being handled twice
        event.preventDefault();
      }, true);
    }
  }