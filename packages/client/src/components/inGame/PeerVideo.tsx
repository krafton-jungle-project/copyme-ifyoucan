import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { peerAtom } from '../../app/peer';

const Video = styled.video`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  position: absolute;
  border: 5px solid blue;
  bottom: 5%;
  right: 5%;
  width: 15%;
  height: auto;
`;

const PeerVideo = () => {
  const peer = useAtomValue(peerAtom);
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = peer.stream;
  }, [peer]);

  return <Video ref={ref} autoPlay />;
};

export default PeerVideo;
