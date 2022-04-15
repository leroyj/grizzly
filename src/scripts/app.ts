import { GameEnvironment } from './GameEnvironment';
import { ScoreBoard } from './ScoreBoard';
import { Keyboarder } from './Keyboarder';
import level1 from '../levels/level1.json';
import level2 from '../levels/level2.json';
import level3 from '../levels/level3.json';
import level4 from '../levels/level4.json';
import { JsonLevel } from './JsonLevelType'

const levelArray = [level1 as JsonLevel,level2 as JsonLevel, level3 as JsonLevel, level4 as JsonLevel]
let level = 0;
const gameElement:Element = document.getElementById('game') ?? (() => {throw new Error("ERROR: No game Element in HTML page")})();
let currentScore=0;
let score:ScoreBoard= new ScoreBoard(currentScore);
const keyboarder:Keyboarder = new Keyboarder();
// @ts-ignore
let gameEnvironment:GameEnvironment;

window.addEventListener('load', function () {
  gameEnvironment=new GameEnvironment(levelArray[level],score,keyboarder);
})

gameElement.addEventListener('nextLevel', function (event:Event) {
  const detail = (<CustomEvent>event).detail;
  console.error("level: "+(level+1)+"(array:"+level+") ");
  if (detail.slice(-1)<level) {
    console.log("[APP] Event received for -"+detail+"- when we are at level index"+level);
    return;
  }
  event.stopImmediatePropagation();
  level+=1;
  if (level<levelArray.length){
    //reinitialize html by cleaning up game and music-playe tags
    currentScore=score.getScore();
    gameElement.innerHTML="";
    const musicWrapperElement:Element = document.getElementById('music-player') ?? (() => {throw new Error("ERROR: No music-wrapper Element in HTML page")})(); 
    musicWrapperElement.innerHTML="";
    keyboarder.reinitialize();
    score = new ScoreBoard(currentScore);
    console.log(levelArray[level]);
    gameEnvironment=new GameEnvironment(levelArray[level],score,keyboarder);
    return;
  } else {
    score.displayGameOver();
  }
}, false);

