import type { Pose } from '@tensorflow-models/pose-detection';
import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

export enum GameStatus {
  WAITING,
  GAME,
  RESULT,
}

export enum GameStage {
  INITIAL,
  ROUND,
  OFFEND,
  DEFEND,
}

// Standard interface and functions
export interface GameState {
  status: GameStatus;
  round: number;
  stage: number;
  isOffender: boolean;
}

const initialState: GameState = {
  status: GameStatus.WAITING,
  round: 1,
  stage: GameStage.INITIAL,
  isOffender: false,
};

export const gameAtom = atomWithReset(initialState);
export const messageAtom = atom('');
export const peerPoseAtom = atom<Pose | undefined>(undefined);
export const countDownAtom = atom(-1);
export const myScoreAtom = atom(0);
