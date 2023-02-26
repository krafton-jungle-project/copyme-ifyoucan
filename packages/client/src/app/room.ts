import { atomWithReset } from 'jotai/utils';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import type { Room, Rooms } from 'project-types';
import { useMemo } from 'react';

const roomsAtom = atom<Rooms>({});

const updateRoomsAtom = atom(null, (get, set, newRooms: Rooms) => {
  set(roomsAtom, newRooms);
});

const useRoomAtom = () => {
  const rooms = useAtomValue(roomsAtom);
  const updateRooms = useSetAtom(updateRoomsAtom);
  const roomsList: (Room & { id: string })[] = useMemo(
    () => Object.entries(rooms).map(([id, room]) => ({ id, ...room })),
    [rooms],
  );

  return { rooms, roomsList, updateRooms };
};

interface RoomState {
  roomId: string;
  host: boolean;
}

const RoomInitialState: RoomState = {
  roomId: '',
  host: false,
};

const roomInfoAtom = atomWithReset(RoomInitialState);

export { roomInfoAtom, useRoomAtom };
