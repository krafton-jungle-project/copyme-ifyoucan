import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { peerAtom } from '../../app/peer';

const Video = styled.video`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  position: absolute;
  box-sizing: border-box;
  border: 5px solid blue;
  bottom: 5%;
  right: 5%;
  width: 15%;
  aspect-ratio: 4/3;
`;

const PeerVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peer = useAtomValue(peerAtom);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = peer.stream;
  }, [peer]);

  return <Video ref={videoRef} autoPlay />;
};

export default PeerVideo;
