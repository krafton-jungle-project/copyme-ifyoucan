import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { peerAtom } from '../../../app/peer';
import DefaultProfileImg from '../../../assets/images/default-profile.png';
import { isStartAtom } from '../InGame';

const Container = styled.div<{ isStart: boolean }>`
  position: absolute;
  top: 50%;
  right: 0%;
  transform: translate(0, -50%); /* 세로 가운데 정렬(top: 50%와 같이 사용) */
  width: 100%;
  aspect-ratio: 1;
  transition-property: right;
  transition-duration: 0.5s;
  border-radius: 20px;
  background-color: grey;
`;

const Img = styled.img`
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
  border-radius: 20px;
`;

const Video = styled.video`
  position: absolute;
  object-fit: cover;
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  width: 100%;
  height: 100%;
  border-radius: 20px;
`;

const PeerVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peer = useAtomValue(peerAtom);
  const isStart = useAtomValue(isStartAtom);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = peer.stream;
  }, [peer.stream]);

  return (
    <Container isStart={isStart}>
      <Img src={DefaultProfileImg} />
      <Video ref={videoRef} autoPlay />
    </Container>
  );
};

export default PeerVideo;
