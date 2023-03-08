import { atom, useAtomValue, useSetAtom } from 'jotai';
import { atomWithReset } from 'jotai/utils';
import type { IGameMode, Room, Rooms } from 'project-types';
import { useMemo } from 'react';

interface RoomState {
  roomId: string;
  host: boolean;
  gameMode: IGameMode;
}

enum GameMode {
  NORMAL,
  BLUR,
  SPIN,
  SIZEDOWN,
}

const RoomInitialState: RoomState = {
  roomId: '',
  host: false,
  gameMode: {
    round1: GameMode.NORMAL,
    round2: GameMode.NORMAL,
    round3: GameMode.NORMAL,
  },
};

const roomInfoAtom = atomWithReset(RoomInitialState);
const createRoomModalAtom = atom(false);
const fadeOutAtom = atom(true);

const roomsAtom = atom<Rooms>({});

const updateRoomsAtom = atom(null, (get, set, newRooms: Rooms) => {
  set(roomsAtom, newRooms);
});

const useRoomAtom = () => {
  const rooms = useAtomValue(roomsAtom);
  const updateRooms = useSetAtom(updateRoomsAtom);
  const roomList: (Room & { id: string })[] = useMemo(
    () => Object.entries(rooms).map(([id, room]) => ({ id, ...room })),
    [rooms],
  );
  return { rooms, roomList, updateRooms };
};

const exitInGameAtom = atom(false);

export { roomInfoAtom, useRoomAtom, createRoomModalAtom, fadeOutAtom, GameMode, exitInGameAtom };
