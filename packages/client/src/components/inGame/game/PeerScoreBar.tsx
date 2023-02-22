import styled from 'styled-components';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { gameAtom, GameStage, GameStatus } from '../../../app/game';
import { isStartAtom } from '../InGame';
import { peerAtom } from '../../../app/peer';

const Container = styled.div`
  position: absolute;
  left: 0%;
  width: calc(100% * (1 / 6));
  height: 100%;
`;

const ScoreBarWrapper = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  border: 5px solid blue;
  background-color: blue;
  border-radius: 20px;
`;

const ScoreBar = styled.div<{ isInit: boolean; score: number }>`
  position: absolute;
  width: 100%;
  height: ${(props) => `${(100 - props.score).toString()}%`};
  transition-property: height;
  transition-delay: ${(props) => (props.isInit ? '1.2s' : '0s')};
  transition-duration: ${(props) => (props.isInit ? '0.7s' : '0.5s')};
  background-color: #5d5c78;
  border-radius: 20px;
`;

const ScoreInfo = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  top: 0%;
  width: 100%;
  height: 10%;
  font-size: 25px;
  font-weight: bold;
  color: #3366ff;
`;

const ScorePercent = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  bottom: 0%;
  width: 100%;
  height: 10%;
  font-size: 30px;
  font-weight: bold;
  color: #3366ff;
`;

function PeerScoreBar({ peerVideoRef }: { peerVideoRef: React.RefObject<HTMLVideoElement> }) {
  const game = useAtomValue(gameAtom);
  const peer = useAtomValue(peerAtom);
  const isStart = useAtomValue(isStartAtom);
  const [isInit, setIsInit] = useState(true);

  //todo: 시작 때 스코어바 움직이기 더 쉬운 방법으로..
  useEffect(() => {
    if (game.status === GameStatus.WAITING) {
      setIsInit(true);
    } else if (game.status === GameStatus.GAME) {
      if (game.stage === GameStage.DEFEND_COUNTDOWN) {
        setIsInit(false);
      }
    }
  }, [game.status, game.stage]);

  return (
    <Container>
      <ScoreInfo>유사도</ScoreInfo>
      <ScoreBarWrapper>
        <ScoreBar isInit={isInit} score={isStart ? peer.score : 100} />
      </ScoreBarWrapper>
      <ScorePercent>{peer.score}</ScorePercent>
    </Container>
  );
}

export default PeerScoreBar;
