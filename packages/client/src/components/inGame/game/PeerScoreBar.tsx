import styled, { css, keyframes } from 'styled-components';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { gameAtom, GameStage } from '../../../app/game';

const Container = styled.div`
  position: absolute;
  left: 0%;
  width: calc(100% * (1 / 6));
  height: 100%;
`;

const ScoreBarWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  background-color: rgba(0, 0, 0, 0.3);
  border: 0.2rem solid #fff;
  border-radius: 20px;
  box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #1f51ff, 0 0 0.8rem #1f51ff,
    0 0 2.8rem #1f51ff, inset 0 0 1.3rem #1f51ff;
`;

const animate = keyframes`
  0%, 100% {
    opacity: 0.5;
    filter: hue-rotate(0deg);
  }
  50% {
    opacity: 1;
    filter: hue-rotate(30deg) blur(1px);
  }
`;

const ScoreBar = styled.div<{ isInit: boolean; score: number; isDefense: boolean }>`
  position: absolute;
  bottom: 0%;
  width: 100%;
  height: ${(props) => `${props.score.toString()}%`};
  transition-property: height;
  transition-delay: ${(props) => (props.isInit ? '1.2s' : '0s')};
  transition-duration: ${(props) => (props.isInit ? '1.5s' : '0.5s')};
  background-color: ${(props) => (props.score > 50 ? '#1f51ff' : '#888')};
  border-radius: 20px;
  ${(props) =>
    (props.isInit || (props.score > 50 && props.isDefense)) &&
    css`
      background-color: #1f51ff;
      animation: ${animate} 1.5s linear infinite;
    `}
`;

const ScorePercent = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  top: 0%;
  width: 100%;
  height: 10%;
  font-size: 40px;
  font-weight: bold;
  color: #1f51ff;
`;

const ScoreInfo = styled.div`
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #1f51ff;
`;

function PeerScoreBar() {
  const game = useAtomValue(gameAtom);
  const [isInit, setIsInit] = useState(true);

  // 게임 시작 시 스코어바 이펙트(게임중에는 빠르게 변화)
  useEffect(() => {
    if (game.stage === GameStage.INITIAL) {
      setIsInit(true);
    } else {
      setIsInit(false);
    }
  }, [game.stage]);

  return (
    <Container>
      <ScorePercent>{game.peer.score}</ScorePercent>
      <ScoreBarWrapper>
        <ScoreBar
          isInit={isInit}
          score={game.isStart ? game.peer.score : 100}
          isDefense={game.user.isOffender && game.stage === GameStage.DEFEND}
        />
      </ScoreBarWrapper>
      <ScoreInfo>유사도</ScoreInfo>
    </Container>
  );
}

export default PeerScoreBar;
