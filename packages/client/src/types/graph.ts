import { atom } from 'jotai';

const gVideoRefAtom = atom<HTMLVideoElement | null>(null);
const gCanvasRefAtom = atom<HTMLCanvasElement | null>(null);

export { gCanvasRefAtom, gVideoRefAtom };
