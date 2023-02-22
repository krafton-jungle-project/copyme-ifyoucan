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

function PeerScoreBar() {
  const game = useAtomValue(gameAtom);
  const peer = useAtomValue(peerAtom);
  const isStart = useAtomValue(isStartAtom);
  const [isInit, setIsInit] = useState(true);

  //todo: 조금 더 효율적으로 할 방법 생각(게임 시작 시 스코어바 이펙트)
  useEffect(() => {
    // 초기화(시작 이펙트)
    if (game.status === GameStatus.WAITING) {
      setIsInit(true);
    }

    // 게임중에는 빠르게 변화
    if (game.stage !== GameStage.INITIAL) {
      setIsInit(false);
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
