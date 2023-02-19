import { atom, useAtom } from 'jotai';
import type { Room, Irooms } from 'project-types';
import { useMemo } from 'react';

const roomsAtom = atom<Irooms>({});

const updateRoomsAtom = atom(null, (get, set, newRooms: Irooms) => {
  set(roomsAtom, newRooms);
});

const useRoomAtom = () => {
  const [rooms] = useAtom(roomsAtom);
  const [, updateRooms] = useAtom(updateRoomsAtom);
  const roomsList: (Room & { id: string })[] = useMemo(
    () => Object.entries(rooms).map(([id, room]) => ({ id, ...room })),
    [rooms],
  );

  return { rooms, roomsList, updateRooms };
};

export default useRoomAtom;
