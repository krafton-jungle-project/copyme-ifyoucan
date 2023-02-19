import { atom } from 'jotai';

export const nickNameAtom = atom('');
nickNameAtom.onMount = (onMountnickNameAtom) => {
  return () => onMountnickNameAtom('');
};

export const hostAtom = atom(false);
hostAtom.onMount = (onMounthostAtom) => {
  return () => onMounthostAtom(false);
};

export const roomIdAtom = atom('');
roomIdAtom.onMount = (onMountroomIdAtom) => {
  return () => onMountroomIdAtom('');
};
