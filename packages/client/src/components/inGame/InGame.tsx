import RoomHeader from './RoomHeader';
import WaitingBox from './waiting/WaitingBox';
import GameBox from './game/GameBox';
import styled from 'styled-components';
import { atom, useAtomValue, useSetAtom } from 'jotai';
import { gameAtom, GameStatus } from '../../app/game';
import { useEffect } from 'react';
import SetReadyState from './waiting/SetReadyState';

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  height: 90%;
`;

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

  useEffect(() => {
    setIsStart(game.status !== GameStatus.WAITING);
  }, [game.status]);

  // SetReadyState();

  return (
    <Container>
      <RoomHeader />
      <WaitingBox />
      <GameBox />
    </Container>
  );
}

export default InGame;
