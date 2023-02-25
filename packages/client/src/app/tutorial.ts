import { atom } from 'jotai';

export const tutorialPassAtom = atom(false);
tutorialPassAtom.onMount = (onMountTutorialPassAtom) => {
  return () => onMountTutorialPassAtom(false);
};

export const tutorialContentAtom = atom('튜토리얼');
tutorialContentAtom.onMount = (onMountTutorialContentAtom) => {
  return () => onMountTutorialContentAtom('튜토리얼');
};

export const tutorialImgAtom = atom('');
tutorialImgAtom.onMount = (onMountTutorialImgAtom) => {
  return () => onMountTutorialImgAtom('');
};

export const isBodyAtom = atom(false);
export const isLeftAtom = atom(false);
export const isRightAtom = atom(false);
export const isTPoseAtom = atom(false);
export const isSDRAtom = atom(false);
export const isStartedAtom = atom(false);
