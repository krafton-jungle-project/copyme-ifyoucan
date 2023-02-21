import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { gameAtom, GameStatus } from '../../../app/game';
import HardPosesImg from '../../../assets/images/hard-poses-white.png';

const Img = styled.img<{ isStart: boolean }>`
  position: absolute;
  visibility: ${(props) => (props.isStart ? 'visible' : 'hidden')};
  bottom: ${(props) => (props.isStart ? '5%' : '-10%')};
  left: 5%;
  width: 90%;
  height: 10%;
  transition-property: bottom;
  transition-delay: 0.5s;
  transition-duration: 1s;
`;

function HardPoses() {
  const game = useAtomValue(gameAtom);
  const [isStart, setIsStart] = useState(false);

  useEffect(() => {
    setIsStart(game.status !== GameStatus.WAITING);
  }, [game.status]);

  return <Img alt="hard poses" src={HardPosesImg} isStart={isStart} />;
}

export default HardPoses;
