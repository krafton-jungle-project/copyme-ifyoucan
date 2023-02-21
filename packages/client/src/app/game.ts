import type { Pose } from '@tensorflow-models/pose-detection';
import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

export enum GameStatus {
  WAITING,
  GAME,
  RESULT,
}

export enum GameStage {
  GAME_SETTING,
  INITIAL_ANNOUNCEMENT,
  OFFEND_ANNOUNCEMENT,
  OFFEND_COUNTDOWN,
  DEFEND_ANNOUNCEMENT,
  DEFEND_COUNTDOWN,
}

// Standard interface and functions
export interface GameState {
  status: GameStatus;
  isOffender: boolean;
  stage: number;
  round: number;
}

const initialState: GameState = {
  status: GameStatus.WAITING,
  isOffender: false,
  stage: GameStage.INITIAL_ANNOUNCEMENT,
  round: 0,
};

export const gameAtom = atomWithReset(initialState);

export const messageAtom = atom('');

export const myPoseAtom = atom<Pose | undefined>(undefined);

export const peerPoseAtom = atom<Pose | undefined>(undefined);
