import { atomWithReset } from 'jotai/utils';

interface PeerState {
  socketId: string;
  nickName: string;
  stream: MediaStream | null;
}

const peerInitialState: PeerState = {
  socketId: '',
  nickName: '',
  stream: null,
};
const peerInfoAtom = atomWithReset(peerInitialState);

export { peerInfoAtom };
