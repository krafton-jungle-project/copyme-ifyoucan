import countdown from '../assets/sounds/count-down.mp3';
import gamemusic from '../assets/sounds/game-music.mp3';
import bell from '../assets/sounds/bell.mp3';
import gunreload from '../assets/sounds/gun-reload.mp3';
import cameraclick from '../assets/sounds/camera-click.mp3';
import backgroundmusic from '../assets/sounds/background-music.mp3';
import roundone from '../assets/sounds/round-one.mp3';
import roundtwo from '../assets/sounds/round-two.mp3';
import roundthree from '../assets/sounds/round-three.mp3';
import roomenter from '../assets/sounds/room-enter.mp3';
import roomexit from '../assets/sounds/room-exit.mp3';

const countDown = new Audio(countdown);
const gameMusic = new Audio(gamemusic);
const Bell = new Audio(bell);
const gunReload = new Audio(gunreload);
const cameraClick = new Audio(cameraclick);
const backgroundMusic = new Audio(backgroundmusic);
const roundOne = new Audio(roundone);
const roundTwo = new Audio(roundtwo);
const roundThree = new Audio(roundthree);
const roomEnter = new Audio(roomenter);
const roomExit = new Audio(roomexit);

export {
  countDown,
  gameMusic,
  Bell,
  gunReload,
  cameraClick,
  backgroundMusic,
  roundOne,
  roundTwo,
  roundThree,
  roomEnter,
  roomExit,
};
