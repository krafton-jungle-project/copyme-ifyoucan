import type { Pose } from '@tensorflow-models/pose-detection';
import { atom } from 'jotai';
import { atomWithReset } from 'jotai/utils';

interface UserState {
  isValidBody: boolean;
  isReady: boolean;
  score: number;
  isOffender: boolean;
}

interface PeerState {
  isReady: boolean;
  score: number;
  pose: Pose | null;
}

enum GameStatus {
  WAITING,
  GAME,
  RESULT,
}

enum GameStage {
  INITIAL,
  ROUND,
  OFFEND,
  DEFEND,
}

enum ItemType {
  BLUR,
  HIDE,
  STICKMAN,
}

interface GameState {
  user: UserState;
  peer: PeerState;
  isStart: boolean;
  status: GameStatus;
  stage: number;
  round: number;
  countDown: number;
  item_type: number;
}

const initialState: GameState = {
  user: {
    isValidBody: false,
    isReady: false,
    score: 0,
    isOffender: false,
  },
  peer: {
    isReady: false,
    score: 0,
    pose: null,
  },
  isStart: false,
  status: GameStatus.WAITING,
  stage: GameStage.INITIAL,
  round: 1,
  countDown: 0,
  item_type: 100,
};

const gameAtom = atomWithReset(initialState);

export { GameStatus, GameStage, ItemType, gameAtom };
