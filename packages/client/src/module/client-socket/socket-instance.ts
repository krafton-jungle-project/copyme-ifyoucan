import { io } from 'socket.io-client';
import type { ClientSocket } from './types';

const SOCKET_SERVER_URL = `http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SOCKET_PORT}`;

const clientSocket: ClientSocket = io(SOCKET_SERVER_URL, {
  closeOnBeforeunload: false, // defaults to true
});
export { clientSocket };
