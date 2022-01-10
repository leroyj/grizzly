import { GameEnvironment } from './GameEnvironment';
import { Score } from './score';
import level1 from '../levels/level1.json';
import { Keyboarder } from './Keyboarder';
//import level2 from '../levels/level2.json';


window.addEventListener('load', function () {
  const score:Score = new Score(10);
  const keyboarder:Keyboarder = new Keyboarder();
  new GameEnvironment(level1,score,keyboarder);
  //new GameEnvironment(level2,score);
})


