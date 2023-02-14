import type { Socket } from 'socket.io-client';
import type { ServerToClientEvents, ClientToServerEvents } from 'project-types';

// please note that the types are reversed
export type WrappedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
