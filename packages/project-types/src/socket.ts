/**
 * 해당하는 타입파일을 정의하면 socket.io에서 자동으로 타입을 인식한다.
 * 추가타입 반영시 yarn install 하여 패키지의 업데이트 사항을 반영해야한다.
 * @see https://socket.io/docs/v4/typescript/
 */
import type * as poseDetection from '@tensorflow-models/pose-detection';

export interface ServerToClientEvents {
  full: () => void;
  get_rooms: (rooms: any) => void;
  new_room: (roomId: string) => void;
  get_ready: () => void;
  get_unready: () => void;
  get_image_reset: () => void;
  get_image: (pose: poseDetection.Pose, imgSrc: string) => void;
  get_start: () => void;
  get_attack: () => void;
  get_finish: () => void;
  peer: (data: { id: string; nickName: string }) => void;
  greeting: (data: { message: string }) => void;
  get_offer: (offer: any) => void;
  get_answer: (answer: any) => void;
  get_ice: (offer: any) => void;
  message: (data: { username: string; message: string }) => void;
  user_exit: () => void;
}

export interface ClientToServerEvents {
  rooms: () => void;
  create_room: (roomName: string) => void;
  join_room: (data: { roomId: string; nickName: string }) => void;
  ready: (roomId: string) => void;
  unready: (roomId: string) => void;
  start: (roomId: string) => void;
  image: (data: { pose: poseDetection.Pose; imgSrc: string }) => void;
  image_reset: () => void;
  offer: (data: any) => void;
  answer: (data: any) => void;
  ice: (data: any) => void;
  message: (message: string) => void;
}

export interface InterServerEvents {
  get_rooms: (rooms: any) => void;
  new_room: (roomId: string) => void;
  get_start: () => void;
  peer: (data: { id: string; nickName: string }) => void;
  get_offer: (offer: any) => void;
  get_answer: (answer: any) => void;
  get_ice: (offer: any) => void;
  error: () => void;
  full: () => void;
}

export interface SocketData {
  // name: string;
  // age: number;
  // io.on("connection", (socket) => {
  //   socket.data.name = "john";
  //   socket.data.age = 42;
  // });
}
