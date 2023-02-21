import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { gameAtom, GameStatus } from '../../../app/game';
import MyGameBox from './MyGameBox';
import PeerGameBox from './PeerGameBox';
import Versus from './Versus';

const Container = styled.div<{ isStart: boolean }>`
  position: absolute;
  box-sizing: border-box;
  visibility: ${(props) => (props.isStart ? 'visible' : 'hidden')};
  top: 25%;
  left: 5%;
  width: 90%;
  aspect-ratio: 18/7;
`;

function GameBox() {
  const game = useAtomValue(gameAtom);
  const [isStart, setIsStart] = useState(false);

  useEffect(() => {
    setIsStart(game.status !== GameStatus.WAITING);
  }, [game.status]);

  return (
    <Container isStart={isStart}>
      <MyGameBox />
      <PeerGameBox />
      <Versus />
    </Container>
  );
}

export default GameBox;
