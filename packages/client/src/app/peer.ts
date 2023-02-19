import { atomWithReset } from 'jotai/utils';
import type * as poseDetection from '@tensorflow-models/pose-detection';

// Standard interface and functions
export interface PeerState {
  socketId: string;
  nickName: string;
  stream: MediaStream | null;
  host: boolean; //todo
  isReady: boolean;
  imgSrc: null | string;
  pose: null | poseDetection.Pose;
}

const initialState: PeerState = {
  socketId: '',
  nickName: '',
  stream: null,
  host: false,
  isReady: false,
  imgSrc: null,
  pose: null,
};

//!  이니셜타입에 해당 타입을 명시하면 추론이 가능하게 되어있네요 - @minhoyooDEV
export const peerAtom = atomWithReset(initialState);
