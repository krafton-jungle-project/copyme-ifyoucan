import countdown from '../assets/sounds/count-down.mp3';
import gamemusic from '../assets/sounds/game-music.mp3';
import bell from '../assets/sounds/bell.mp3';
import gunreload from '../assets/sounds/gun-reload.mp3';
import cameraclick from '../assets/sounds/camera-click.mp3';
import backgroundmusic from '../assets/sounds/background-music.mp3';

const countDown = new Audio(countdown);
const gameMusic = new Audio(gamemusic);
const Bell = new Audio(bell);
const gunReload = new Audio(gunreload);
const cameraClick = new Audio(cameraclick);
const backgroundMusic = new Audio(backgroundmusic);

export { countDown, gameMusic, Bell, gunReload, cameraClick, backgroundMusic };
