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
  score: number;
}

const initialState: PeerState = {
  socketId: '',
  nickName: '',
  stream: null,
  host: false,
  isReady: false,
  imgSrc: null,
  pose: null,
  score: 0,
};

export const peerAtom = atomWithReset(initialState);
