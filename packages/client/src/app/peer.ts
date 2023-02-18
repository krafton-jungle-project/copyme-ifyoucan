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

const initialState = {
  socketId: '',
  nickName: '',
  stream: null,
  host: false,
  isReady: false,
  imgSrc: null,
  pose: null,
};

// Atoms
export const peerAtom = atomWithReset<PeerState>(initialState);
