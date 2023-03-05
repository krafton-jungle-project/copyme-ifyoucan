import { IGameMode } from './socket';

export type Room = {
  roomName: string;
  users: { id: string; nickName: string }[];
  isStart: boolean;
  readyCount: number;
  gameMode: IGameMode;
  thumbnailIdx: number;
};

// export interface Rooms {
export interface Rooms {
  [key: string]: Room;
}

export {};
