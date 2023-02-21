import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { stream } from '../../../utils/tfjs-movenet';
import DefaultProfileImg from '../../../assets/images/default-profile.png';
import { isStartAtom } from '../InGame';

const Container = styled.div<{ isStart: boolean }>`
  position: absolute;
  top: 50%;
  left: 0%;
  transform: translate(0, -50%);
  /* 세로 가운데 정렬(top: 50%와 같이 사용) */
  width: 100%;
  aspect-ratio: 1;
  transition-property: left;
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

function MyVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const isStart = useAtomValue(isStartAtom);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, []);

  return (
    <Container isStart={isStart}>
      <Img src={DefaultProfileImg} />
      <Video ref={videoRef} autoPlay></Video>
    </Container>
  );
}

export default MyVideo;
