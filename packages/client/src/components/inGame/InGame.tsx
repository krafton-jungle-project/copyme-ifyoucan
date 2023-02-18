import type { Socket } from 'socket.io-client';
import PeerVideo from './PeerVideo';
import MyVideo from './MyVideo';
import { useRef } from 'react';
import { useAtomValue } from 'jotai';
import { peerAtom } from '../../app/peer';

function InGame({ socket }: { socket: Socket }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peer = useAtomValue(peerAtom);

  return (
    <>
      <MyVideo inheritRef={videoRef} />
      {peer.stream ? <PeerVideo peer={peer} /> : <></>}
    </>
  );
}

export default InGame;
