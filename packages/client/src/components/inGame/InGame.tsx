import RoomHeader from './RoomHeader';
import WaitingBox from './waiting/WaitingBox';
import GameBox from './game/GameBox';
import styled from 'styled-components';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { gameAtom, GameStatus } from '../../app/game';
import { useEffect } from 'react';
import { imValidBodyAtom, motionReadyDelayAtom } from './waiting/MotionReady';

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  height: 90%;
`;

//todo: 한 곳에 모으기(Game Handler)
export const isStartAtom = atom(false);
isStartAtom.onMount = (setAtom) => {
  setAtom(false);
  return () => {
    setAtom(false);
  };
};

function InGame() {
  const game = useAtomValue(gameAtom);
  const setIsStart = useSetAtom(isStartAtom);
  const setMotionReadyDelay = useSetAtom(motionReadyDelayAtom);
  const setImValidBody = useSetAtom(imValidBodyAtom);

  //todo: 한 곳에 모으기(Game Handler)
  useEffect(() => {
    setImValidBody(false);
    if (game.status === GameStatus.WAITING) {
      setIsStart(false);
      setMotionReadyDelay(500);
    } else {
      setIsStart(true);
      setMotionReadyDelay(null);
    }
  }, [game.status]);

  return (
    <Container>
      <RoomHeader />
      <WaitingBox />
      <GameBox />
    </Container>
  );
}

export default InGame;
