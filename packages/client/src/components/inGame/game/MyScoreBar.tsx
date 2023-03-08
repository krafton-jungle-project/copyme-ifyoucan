import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { gameAtom, GameStage } from '../../../app/game';
import { useClientSocket } from '../../../module/client-socket';
import { useMovenetStream } from '../../../module/movenet-stream';
import { vectorComparePoses } from '../../../utils/pose-similarity';
import useCountNum from '../hooks/useCountNum';
import { useInterval } from '../hooks/useInterval';

const Container = styled.div`
  position: absolute;
  right: 0;
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
  box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #ff3131, 0 0 0.8rem #ff3131,
    0 0 2.8rem #ff3131, inset 0 0 1.3rem #ff3131;
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
  box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #ff3131, 0 0 0.8rem #ff3131,
    0 0 2.8rem #ff3131, inset 0 0 1.3rem #ff3131;
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
  background-color: ${(props) => (props.score >= 50 ? '#ff3131' : '#888')};
  border-radius: 20px;
  ${(props) =>
    (props.isInit || (props.score >= 50 && props.isDefense)) &&
    css`
      background-color: #ff3131;
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
  color: #ff3131;
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
  color: #ff3131;
`;

function MyScoreBar({ myVideoRef }: { myVideoRef: React.RefObject<HTMLVideoElement> }) {
  const game = useAtomValue(gameAtom);
  const [delay, setDelay] = useState<number | null>(null);
  const { socket } = useClientSocket();
  const detector = useMovenetStream().movenet.detector;

  useInterval(async () => {
    const getMyPose = async () => {
      if (myVideoRef.current) {
        const myPoses = await detector.estimatePoses(myVideoRef.current);
        if (myPoses && myPoses.length > 0) {
          return myPoses[0];
        }
      }
    };

    const myPose = await getMyPose();
    if (myPose && game.peer.pose) {
      // 나의 실시간 점수

      // 기존 채점 방식 (어깨 기준)
      // const tempScore = comparePoses(myPose, game.peer.pose);

      // 24 dimension vector 유사도 계산
      const vectorScore = vectorComparePoses(game.peer.pose, myPose);
      socket.emit('score', vectorScore);
    }
  }, delay);

  useEffect(() => {
    // 내가 수비자이고 수비 스테이지일 때
    if (!game.user.isOffender && game.stage === GameStage.DEFEND) {
      // 수비 카운트 다운이 시작되면
      if (game.countDown === 5) {
        // 실시간 점수 계산 시작(0.5초 간격)
        setDelay(500);
      }
      // 수비가 종료되면
      else if (game.countDown === 0) {
        // 실시간 점수 계산을 멈추고, 자신의 최종 점수를 서버로 보낸다
        setDelay(null);
        socket.emit('round_score', game.user.score);
      }
    }
  }, [game.countDown]);

  return (
    <Container>
      <ScorePercent isJudgement={game.stage === GameStage.JUDGE}>
        {useCountNum(game.user.score, game.stage === GameStage.JUDGE ? 800 : 0)}
      </ScorePercent>
      <ScoreBarWrapper>
        <ScoreBar
          isInit={game.stage === GameStage.INITIAL}
          score={game.isStart ? game.user.score : 100}
          isDefense={!game.user.isOffender && game.stage === GameStage.DEFEND}
        />
        <Criteria
          visible={game.stage === GameStage.DEFEND && !game.user.isOffender && game.user.score < 50}
        >
          <BaseLine />
          <FailTxt>FAIL</FailTxt>
        </Criteria>
      </ScoreBarWrapper>
      <ScoreInfo>유사도</ScoreInfo>
    </Container>
  );
}

export default MyScoreBar;
