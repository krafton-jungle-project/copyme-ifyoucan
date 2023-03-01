import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { peerInfoAtom } from '../../../app/peer';
import DefaultProfileImg from '../../../assets/images/peer-default-profile.jpg';

const Container = styled.div`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(0, -50%); /* 세로 가운데 정렬(top: 50%와 같이 사용) */
  width: 100%;
  aspect-ratio: 1;
  border-radius: 20px;
  box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #1f51ff;
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
  transform: scaleX(-1);
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-color: #0008;
`;

const PeerVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerStream = useAtomValue(peerInfoAtom).stream;

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = peerStream;
  }, [peerStream]);

  return (
    <Container>
      <Img src={DefaultProfileImg} />
      <Video ref={videoRef} autoPlay />
    </Container>
  );
};

export default PeerVideo;
