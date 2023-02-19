import { atom } from 'jotai';

//! 기본값에서 타입을 알 수 있기 때문에 타입을 명시하지 않아도 됩니다 ex<string> - @minhoyooDEV

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
