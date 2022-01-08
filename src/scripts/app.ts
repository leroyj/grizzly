import { GameEnvironment } from './gameEnvironment';
import level from '../levels/level.json';


window.addEventListener('load', function () {
  new GameEnvironment(level);
})


