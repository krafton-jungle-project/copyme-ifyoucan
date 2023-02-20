import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { gameAtom, GameStatus } from '../../app/game';
import { peerAtom } from '../../app/peer';

const Video = styled.video<{ isStart: boolean }>`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  position: absolute;
  box-sizing: border-box;
  border: 5px solid blue;
  bottom: 5%;
  right: ${(props) => (props.isStart ? '-15%' : '5%')};
  width: 15%;
  aspect-ratio: 4/3;
  transition-property: right;
  transition-duration: 1s;
`;

const PeerVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peer = useAtomValue(peerAtom);
  const game = useAtomValue(gameAtom);
  const [isStart, setIsStart] = useState(false);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = peer.stream;
  }, [peer.stream]);

  useEffect(() => {
    setIsStart(game.status !== GameStatus.WAITING);
  }, [game.status]);

  return <Video ref={videoRef} isStart={isStart} autoPlay />;
};

export default PeerVideo;
