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

export const tutorialPassAtom = atom(false);
tutorialPassAtom.onMount = (onMountTutorialPassAtom) => {
  return () => onMountTutorialPassAtom(false);
};

export const tutorialContentAtom = atom('튜토리얼');
tutorialContentAtom.onMount = (onMountTutorialContentAtom) => {
  return () => onMountTutorialContentAtom('튜토리얼');
};
