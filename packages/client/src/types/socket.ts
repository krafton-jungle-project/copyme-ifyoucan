import type { ClientToServerEvents, ServerToClientEvents } from 'project-types';
import type { Socket } from 'socket.io-client';

// ! module/client-socket/types 로 이동하였습니다 / 제거해주세요 - @minhoyooDEV

export type WrappedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;
