import type { Pose } from '@tensorflow-models/pose-detection';
import { atomWithReset } from 'jotai/utils';

interface UserState {
  isValidBody: boolean;
  isReady: boolean;
  score: number;
  isOffender: boolean;
  gradable: boolean;
}

interface PeerState {
  isReady: boolean;
  score: number;
  pose: Pose | null;
  gradable: boolean;
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
  ROTATE,
  SIZEDOWN,
}

interface GameState {
  user: UserState;
  peer: PeerState;
  isStart: boolean;
  status: GameStatus;
  stage: number;
  round: number;
  countDown: number;
  isCaptured: boolean;
  item_type: number;
}

const initialState: GameState = {
  user: {
    isValidBody: false,
    isReady: false,
    score: 0,
    isOffender: false,
    gradable: false,
  },
  peer: {
    isReady: false,
    score: 0,
    pose: null,
    gradable: false,
  },
  isStart: false,
  status: GameStatus.WAITING,
  stage: GameStage.INITIAL,
  round: 1,
  countDown: 0,
  isCaptured: false,
  item_type: 100,
};

const gameAtom = atomWithReset(initialState);

export { GameStatus, GameStage, ItemType, gameAtom };
