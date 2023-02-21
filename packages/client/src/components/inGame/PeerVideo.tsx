import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { gameAtom, GameStatus } from '../../app/game';
import { peerAtom } from '../../app/peer';
import DefaultProfileImg from '../../assets/images/default-profile.png';

const Container = styled.div<{ isStart: boolean }>`
  position: absolute;
  box-sizing: border-box;
  background-color: grey;
  border: 5px solid blue;
  bottom: 5%;
  right: ${(props) => (props.isStart ? '-15%' : '5%')};
  width: 15%;
  aspect-ratio: 4/3;
  transition-property: right;
  transition-duration: 1s;
`;

const Img = styled.img`
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const Video = styled.video`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
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

  return (
    <Container isStart={isStart}>
      <Img src={DefaultProfileImg} />
      <Video ref={videoRef} autoPlay />
    </Container>
  );
};

export default PeerVideo;
