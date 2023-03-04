import { atomWithReset } from 'jotai/utils';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import type { Room, Rooms } from 'project-types';
import { useMemo } from 'react';
import { ItemType } from './game';

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

interface RoomState {
  roomId: string;
  host: boolean;
  itemType: {
    round1: number;
    round2: number;
    round3: number;
  };
}

const RoomInitialState: RoomState = {
  roomId: '',
  host: false,
  itemType: {
    round1: ItemType.NORMAL,
    round2: ItemType.NORMAL,
    round3: ItemType.NORMAL,
  },
};

const roomInfoAtom = atomWithReset(RoomInitialState);
const createRoomModalAtom = atom(false);
const fadeOutAtom = atom(true);

export { roomInfoAtom, useRoomAtom, createRoomModalAtom, fadeOutAtom };
