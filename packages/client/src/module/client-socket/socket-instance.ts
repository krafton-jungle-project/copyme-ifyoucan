import { io } from 'socket.io-client';
import type { ClientSocket } from './types';
// console.log(process.env.REACT_APP_SERVER_URL); // should print the server URL
// console.log(process.env.REACT_APP_SOCKET_PORT); // should print the socket port

const SOCKET_SERVER_URL = `http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SOCKET_PORT}`;
// const SOCKET_SERVER_URL = 'http://15.165.237.195:8081';
// const SOCKET_SERVER_URL = 'http://localhost:8081';
const clientSocket: ClientSocket = io(SOCKET_SERVER_URL, {
  closeOnBeforeunload: false, // defaults to true
});
export { clientSocket };
