import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { gameAtom, GameStatus } from '../../app/game';
import { stream } from '../../utils/tfjs-movenet';

const Video = styled.video<{ isStart: boolean }>`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  position: absolute;
  box-sizing: border-box;
  border: 5px solid red;
  bottom: 5%;
  left: ${(props) => (props.isStart ? '-15%' : '5%')};
  width: 15%;
  aspect-ratio: 4/3;
  transition-property: left;
  transition-duration: 1s;
`;

function MyVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const game = useAtomValue(gameAtom);
  const [isStart, setIsStart] = useState(false);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, []);

  useEffect(() => {
    setIsStart(game.status !== GameStatus.WAITING);
  }, [game.status]);

  return <Video ref={videoRef} isStart={isStart} autoPlay></Video>;
}

export default MyVideo;
