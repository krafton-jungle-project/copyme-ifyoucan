import { Rooms } from './rooms';

/**
 * 해당하는 타입파일을 정의하면 socket.io에서 자동으로 타입을 인식한다.
 * 추가타입 반영시 yarn install 하여 패키지의 업데이트 사항을 반영해야한다.
 * @see https://socket.io/docs/v4/typescript/
 */
export interface IChat {
  userId: string;
  message: string;
  isImg: boolean;
}

export interface IGameMode {
  round1: number;
  round2: number;
  round3: number;
}

export interface ServerToClientEvents {
  new_room: (roomId: string, gameMode: IGameMode) => void;
  user_exit: (isStart: boolean) => void;
  get_rooms: (rooms: Rooms) => void;
  get_ready: (socketId: string) => void;
  get_unready: (socketId: string) => void;
  get_start: (socketId: string) => void;
  get_score: (data: { defenderId: string; score: number }) => void;
  get_count_down: (count: number, stage: string) => void;
  get_change_stage: (stage: number) => void;
  get_upload: (images: string[]) => void;
  get_point: (winner: string) => void;
  get_potg: () => void;
  get_finish: () => void;
  peer: (data: { id: string; nickName: string }) => void;
  greeting: (data: { message: string }) => void;
  message: (chat: IChat) => void;
  get_offer: (data: {
    sdp: RTCSessionDescription;
    offerSendID: string;
    offerSendNickName: string;
  }) => void;
  get_answer: (answer: RTCSessionDescription) => void;
  get_ice: (data: RTCIceCandidate) => void;
}

export interface ClientToServerEvents {
  rooms: () => void;
  create_room: (data: { roomName: string; gameMode: IGameMode; thumbnailIdx: number }) => void;
  join_room: (data: { roomId: string; nickName: string }) => void;
  exit_room: (nickName: string) => void;
  ready: (roomId: string) => void;
  unready: (roomId: string) => void;
  start: (roomId: string) => void;
  score: (score: number) => void;
  round_score: (score: number) => void;
  potg: () => void;
  count_down: (stage: string) => void;
  message: (message: string, callback: (chat: IChat) => void) => void;
  change_stage: (stage: number) => void;
  point: (winnerId: string) => void;
  offer: (data: {
    sdp: RTCSessionDescriptionInit;
    offerSendID: string;
    offerSendNickName: string;
    offerReceiveID: string;
  }) => void;
  answer: (data: {
    sdp: RTCSessionDescriptionInit;
    answerSendID: string;
    answerReceiveID: string;
  }) => void;
  ice: (data: {
    candidate: RTCIceCandidate;
    candidateSendID: string;
    candidateReceiveID: string;
  }) => void;
}

export interface InterServerEvents {
  new_room: (roomId: string, gameMode: IGameMode) => void;
  get_rooms: (rooms: Rooms) => void;
  get_ready: (socketId: string) => void;
  get_unready: (socketId: string) => void;
  get_start: (socketId: string) => void;
  get_score: (data: { defenderId: string; score: number }) => void;
  get_count_down: (count: number, stage: string) => void;
  get_change_stage: (stage: number) => void;
  get_potg: () => void;
  get_finish: () => void;
  get_upload: (images: string[]) => void;
  get_point: (winnerId: string) => void;
  peer: (data: { id: string; nickName: string }) => void;
  message: (chat: IChat) => void;
  get_offer: (offer: {
    sdp: RTCSessionDescription;
    offerSendID: string;
    offerSendNickName: string;
  }) => void;
  get_answer: (answer: RTCSessionDescription) => void;
  get_ice: (data: RTCIceCandidate) => void;
  error: () => void;
}
