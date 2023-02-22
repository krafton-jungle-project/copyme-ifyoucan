import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { gameAtom, GameStage, GameStatus } from '../../app/game';
import { peerAtom } from '../../app/peer';

const Container = styled.div`
  position: absolute;
  background-color: blue;
  border: 5px solid blue;
  box-sizing: border-box;
  left: 0%;
  width: calc(100% * (1 / 8) * (4 / 5));
  height: 100%;
`;

const ScoreBar = styled.div<{ isInit: boolean; isStart: boolean; score: number }>`
  background-color: #5d5c78;
  width: 100%;
  height: ${(props) => `${(100 - props.score).toString()}%`};
  transition-property: height;
  transition-delay: ${(props) => (props.isInit ? '1.2s' : '0s')};
  transition-duration: ${(props) => (props.isInit ? '0.7s' : '0.5s')};
`;

function PeerScoreBar({ peerVideoRef }: { peerVideoRef: React.RefObject<HTMLVideoElement> }) {
  const game = useAtomValue(gameAtom);
  const peer = useAtomValue(peerAtom);
  const [isStart, setIsStart] = useState(false);
  const [isInit, setIsInit] = useState(true);

  useEffect(() => {
    if (game.status === GameStatus.WAITING) {
      setIsStart(false);
      setIsInit(true);
    } else if (game.status === GameStatus.GAME) {
      setIsStart(true);
      if (game.stage === GameStage.DEFEND_COUNTDOWN) {
        setIsInit(false);
      }
    }
  }, [game.status, game.stage]);

  return (
    <Container>
      <ScoreBar isInit={isInit} isStart={isStart} score={isStart ? peer.score : 100} />
    </Container>
  );
}

export default PeerScoreBar;
