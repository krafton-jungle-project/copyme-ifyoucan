import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { gameAtom, GameStatus } from '../../app/game';
import VersusImg from '../../assets/images/versus.png';

const VS = styled.img<{ isStart: boolean }>`
  position: absolute;
  top: ${(props) => (props.isStart ? '30%' : '40%')};
  left: ${(props) => (props.isStart ? '42.5%' : '50%')};
  width: ${(props) => (props.isStart ? '15%' : '0%')};
  height: ${(props) => (props.isStart ? '20%' : '0%')};
  transition-property: top, left, width, height;
  transition-delay: 1s;
  transition-duration: 0.5s, 0.5s, 0.5s, 0.5s;
`;

function Versus() {
  const game = useAtomValue(gameAtom);
  const [isStart, setIsStart] = useState(false);

  useEffect(() => {
    setIsStart(game.status !== GameStatus.WAITING);
  }, [game.status]);

  return <VS alt="VS" src={VersusImg} isStart={isStart} />;
}

export default Versus;
