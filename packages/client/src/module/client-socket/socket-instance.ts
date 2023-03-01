import { io } from 'socket.io-client';
import type { ClientSocket } from './types';

const SOCKET_SERVER_URL = 'http://localhost:8081';
// const SOCKET_SERVER_URL = 'http://15.165.237.195:8081';

const clientSocket: ClientSocket = io(SOCKET_SERVER_URL, {
  closeOnBeforeunload: false, // defaults to true
});

export { clientSocket };
