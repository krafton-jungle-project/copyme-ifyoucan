import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { gameAtom, GameStatus } from '../../app/game';
import MyCanvas from './MyCanvas';
import MyScoreBar from './MyScoreBar';

const Container = styled.div<{ isStart: boolean }>`
  position: absolute;
  box-sizing: border-box;
  border: 5px solid orange;
  top: 20%;
  left: ${(props) => (props.isStart ? '5%' : '-40%')};
  width: 40%; /* 35% * (8 / 7) */
  aspect-ratio: 32/21; /* 4 * (8 / 7) : 3 */
  transition-property: left;
  transition-delay: 0.5s;
  transition-duration: 0.5s;
`;

function MyGameBox() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const game = useAtomValue(gameAtom);
  const [isStart, setIsStart] = useState(false);

  useEffect(() => {
    setIsStart(game.status !== GameStatus.WAITING);
  }, [game.status]);

  return (
    <Container isStart={isStart}>
      <MyCanvas myVideoRef={videoRef} />
      <MyScoreBar myVideoRef={videoRef} />
    </Container>
  );
}

export default MyGameBox;
