import { atomWithReset } from 'jotai/utils';

interface RoomState {
  roomId: string;
  host: boolean;
}

const RoomInitialState: RoomState = {
  roomId: '',
  host: false,
};

const roomInfoAtom = atomWithReset(RoomInitialState);

export { roomInfoAtom };
