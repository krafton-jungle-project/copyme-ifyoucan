import countdown from '../assets/sounds/count-down.mp3';
import gamemusic from '../assets/sounds/game-music.mp3';
import bell from '../assets/sounds/bell.mp3';
import gunreload from '../assets/sounds/gun-reload.mp3';

const countDown = new Audio(countdown);
const gameMusic = new Audio(gamemusic);
const Bell = new Audio(bell);
const gunReload = new Audio(gunreload);

export { countDown, gameMusic, Bell, gunReload };
