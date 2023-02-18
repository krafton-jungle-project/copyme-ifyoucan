/**
 * 해당하는 타입파일을 정의하면 socket.io에서 자동으로 타입을 인식한다.
 * 추가타입 반영시 yarn install 하여 패키지의 업데이트 사항을 반영해야한다.
 * @see https://socket.io/docs/v4/typescript/
 */
export interface ServerToClientEvents {
  full: () => void;
  other_users: (
    otherUsers: {
      id: string;
      nickName: string;
    }[],
  ) => void;
  get_answer: (offer: any) => void;
}

export interface ClientToServerEvents {
  create_room: (roomName: string) => void;
  user_exit: (socketId: string) => void;
  get_ice: (offer: any) => void;
  get_offer: (offer: any) => void;
}

export interface InterServerEvents {
  get_offer: (offer: any) => void;
  get_rooms: (room: any) => void;
  new_room: (roomId: string) => void;
  other_users: (
    otherUsers: {
      id: string;
      nickName: string;
    }[],
  ) => void;
  error: () => void;
  peer: (otherUsers: { id: string; nickName: string }) => void;
  full: () => void;
  message: (msg: any) => void;
  user_exit: () => void;
}

export interface SocketData {
  // name: string;
  // age: number;
  // io.on("connection", (socket) => {
  //   socket.data.name = "john";
  //   socket.data.age = 42;
  // });
}
