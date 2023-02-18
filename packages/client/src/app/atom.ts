import { atom } from 'jotai';

export const nickNameAtom = atom<string>('');
nickNameAtom.onMount = (onMountnickNameAtom) => {
  return () => onMountnickNameAtom('');
};

export const hostAtom = atom<boolean>(false);
hostAtom.onMount = (onMounthostAtom) => {
  return () => onMounthostAtom(false);
};

export const roomIdAtom = atom<string>('');
roomIdAtom.onMount = (onMountroomIdAtom) => {
  return () => onMountroomIdAtom('');
};
