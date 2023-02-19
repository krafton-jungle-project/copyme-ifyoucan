export type Room = {
  roomName: string;
  users: { id: string; nickName: string }[];
  started: boolean;
  readyCount: number;
};

// TODO: Rooms로 변경해주세요 - @minhoyooDEV
// export interface Rooms {
export interface Irooms {
  [key: string]: Room;
}

export {};
