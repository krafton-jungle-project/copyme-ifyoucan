import countdown from '../assets/sounds/count-down.mp3';
import gamemusic from '../assets/sounds/game-music.mp3';
import bell from '../assets/sounds/bell.mp3';
import gunreload from '../assets/sounds/gun-reload.mp3';
import cameraclick from '../assets/sounds/camera-click.mp3';

const countDown = new Audio(countdown);
const gameMusic = new Audio(gamemusic);
gameMusic.volume = 0.5;
const Bell = new Audio(bell);
const gunReload = new Audio(gunreload);
const cameraClick = new Audio(cameraclick);

export { countDown, gameMusic, Bell, gunReload, cameraClick };
