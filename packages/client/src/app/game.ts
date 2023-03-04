import type { Pose } from '@tensorflow-models/pose-detection';
import { atomWithReset } from 'jotai/utils';

interface UserState {
  isValidBody: boolean;
  isReady: boolean;
  score: number;
  point: number;
  isOffender: boolean;
  gradable: boolean;
}

interface PeerState {
  isReady: boolean;
  score: number;
  point: number;
  pose: Pose | null;
  gradable: boolean;
}

enum GameStage {
  INITIAL,
  ROUND,
  OFFEND,
  DEFEND,
  JUDGE,
}

interface GameState {
  user: UserState;
  peer: PeerState;
  isStart: boolean;
  stage: number;
  round: number;
  countDown: number;
  isCaptured: boolean;
}

const initialState: GameState = {
  user: {
    isValidBody: false,
    isReady: false,
    score: 0,
    point: 0,
    isOffender: false,
    gradable: false,
  },
  peer: {
    isReady: false,
    score: 0,
    point: 0,
    pose: null,
    gradable: false,
  },
  isStart: false,
  stage: GameStage.INITIAL,
  round: 1,
  countDown: 0,
  isCaptured: false,
};

const gameAtom = atomWithReset(initialState);
gameAtom.onMount = (setAtom) => {
  setAtom(initialState);
  return () => setAtom(initialState);
};

export { GameStage, gameAtom };
