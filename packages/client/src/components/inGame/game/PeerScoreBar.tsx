import { useAtomValue } from 'jotai';
import styled, { css, keyframes } from 'styled-components';
import { gameAtom, GameStage } from '../../../app/game';
import useCountNum from '../hooks/useCountNum';

const Container = styled.div`
  position: absolute;
  left: 0;
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
  background-color: #0008;
  border: 0.2rem solid #fff;
  border-radius: 20px;
  box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #1f51ff, 0 0 0.8rem #1f51ff,
    0 0 2.8rem #1f51ff, inset 0 0 1.3rem #1f51ff;
`;

const Criteria = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 50%;
  width: 100%;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`;

const BaseLine = styled.hr`
  border: 1px solid #fff;
  box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #1f51ff, 0 0 0.8rem #1f51ff,
    0 0 2.8rem #1f51ff, inset 0 0 1.3rem #1f51ff;
`;

const FailTxt = styled.p`
  position: absolute;
  margin-top: 5px;
  width: 100%;
  font-size: 20px;
  text-align: center;
  text-shadow: 0 0 2px #fff, 0 0 4px #fff;
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
  bottom: 0;
  width: 100%;
  height: ${(props) => `${props.score.toString()}%`};
  transition: ${(props) => (props.isInit ? 'height 1.5s linear 1.2s' : 'height 0.5s linear')};
  background-color: ${(props) => (props.score >= 50 ? '#1f51ff' : '#888')};
  border-radius: 20px;
  ${(props) =>
    (props.isInit || (props.score >= 50 && props.isDefense)) &&
    css`
      background-color: #1f51ff;
      animation: ${animate} 1.5s linear infinite;
    `}
`;

const ScorePercent = styled.div<{ isJudgement: boolean }>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  top: 0;
  width: 100%;
  height: 10%;
  font-size: 40px;
  font-weight: bold;
  color: #1f51ff;
  transition: 0.3s;

  ${(props) =>
    props.isJudgement &&
    css`
      z-index: 1;
      top: 50%;
      transform: translate(0, -50%);
      font-size: 100px;
      font-weight: 800;
      -webkit-text-stroke: 2px #000;
      text-shadow: 0 0 5px #fff, 0 0 5px #fff, 0 0 5px #fff, 0 0 5px #fff, 0 0 5px #fff;
    `}
`;

const ScoreInfo = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  bottom: 0;
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

  return (
    <Container>
      <ScorePercent isJudgement={game.stage === GameStage.JUDGE}>
        {useCountNum(game.peer.score, game.stage === GameStage.JUDGE ? 800 : 0)}
      </ScorePercent>
      <ScoreBarWrapper>
        <ScoreBar
          isInit={game.stage === GameStage.INITIAL}
          score={game.isStart ? game.peer.score : 100}
          isDefense={game.user.isOffender && game.stage === GameStage.DEFEND}
        />
        <Criteria
          visible={game.stage === GameStage.DEFEND && game.user.isOffender && game.peer.score < 50}
        >
          <BaseLine />
          <FailTxt>FAIL</FailTxt>
        </Criteria>
      </ScoreBarWrapper>
      <ScoreInfo>유사도</ScoreInfo>
    </Container>
  );
}

export default PeerScoreBar;
