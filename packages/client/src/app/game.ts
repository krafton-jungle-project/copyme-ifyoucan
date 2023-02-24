import type { Pose } from '@tensorflow-models/pose-detection';
import { atomWithReset } from 'jotai/utils';

interface UserState {
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

interface GameState {
  user: UserState;
  peer: PeerState;
  isStart: boolean;
  status: GameStatus;
  stage: number;
  round: number;
  countDown: number;
}

const initialState: GameState = {
  user: {
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
};

const gameAtom = atomWithReset(initialState);

export { GameStatus, GameStage, gameAtom };
