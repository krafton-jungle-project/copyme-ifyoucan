export type Room = {
  roomName: string;
  users: { id: string; nickName: string }[];
  isStart: boolean;
  readyCount: number;
};

// export interface Rooms {
export interface Rooms {
  [key: string]: Room;
}

export {};
