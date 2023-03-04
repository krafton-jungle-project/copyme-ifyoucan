import type { ClientToServerEvents, ServerToClientEvents } from 'project-types';
import type { Socket } from 'socket.io-client';

// please note that the types are reversed
export type ClientSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
