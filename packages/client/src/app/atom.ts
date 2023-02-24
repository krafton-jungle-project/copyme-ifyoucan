import { atom } from 'jotai';

export const myNickNameAtom = atom('');
myNickNameAtom.onMount = (onMountMyNickNameAtom) => {
  return () => onMountMyNickNameAtom('');
};

export const imHostAtom = atom(false);
imHostAtom.onMount = (onMountImHostAtom) => {
  return () => onMountImHostAtom(false);
};

export const roomIdAtom = atom('');
roomIdAtom.onMount = (onMountRoomIdAtom) => {
  return () => onMountRoomIdAtom('');
};
