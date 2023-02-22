import styled from 'styled-components';
import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import {
  countDownAtom,
  gameAtom,
  GameStage,
  GameStatus,
  myScoreAtom,
  peerPoseAtom,
} from '../../../app/game';
import { comparePoses } from '../../../utils/pose-similarity';
import { detector } from '../../../utils/tfjs-movenet';
import { useInterval } from '../hooks/useInterval';
import { isStartAtom } from '../InGame';
import { useClientSocket } from '../../../module/client-socket';

const Container = styled.div`
  position: absolute;
  right: 0%;
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
  border: 5px solid #ff3131;
  background-color: #ff3131;
  border-radius: 20px;
`;

const ScoreBar = styled.div<{ isInit: boolean; score: number }>`
  position: absolute;
  width: 100%;
  height: ${(props) => `${(100 - props.score).toString()}%`};
  transition-property: height;
  transition-delay: ${(props) => (props.isInit ? '1.2s' : '0s')};
  transition-duration: ${(props) => (props.isInit ? '0.7s' : '0.5s')};
  background-color: #a66868;
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
  color: #ff3131;
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
  color: #ff3131;
`;

function MyScoreBar({ myVideoRef }: { myVideoRef: React.RefObject<HTMLVideoElement> }) {
  const game = useAtomValue(gameAtom);
  const peerPose = useAtomValue(peerPoseAtom);
  const [myScore, setMyScore] = useAtom(myScoreAtom);
  const [delay, setDelay] = useState<number | null>(null);
  const isStart = useAtomValue(isStartAtom);
  const [isInit, setIsInit] = useState(true);
  const { socket } = useClientSocket();
  const countDown = useAtomValue(countDownAtom);

  const getMyPose = async () => {
    if (myVideoRef.current) {
      const myPoses = await detector.estimatePoses(myVideoRef.current);
      if (myPoses && myPoses.length > 0) {
        return myPoses[0];
      }
    }
  };

  useInterval(async () => {
    const myPose = await getMyPose();
    if (myPose && peerPose) {
      const tempScore = comparePoses(myPose, peerPose);
      socket.emit('score', tempScore);
      setMyScore(tempScore);
    }
  }, delay);

  useEffect(() => {
    // 내가 수비자이고 수비 스테이지일 때
    if (!game.isOffender && game.stage === GameStage.DEFEND) {
      // 수비 카운트 다운이 시작되면
      if (countDown === 3) {
        // 실시간 점수 계산 시작(0.5초 간격)
        setDelay(500);
      }
      // 수비가 종료되면
      else if (countDown === 0) {
        // 실시간 점수 계산을 멈추고, 자신의 최종 점수를 서버로 보낸다

        setDelay(null);
        socket.emit('round_score', myScore);
      }
    }
  }, [countDown]);

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
        <ScoreBar isInit={isInit} score={isStart ? myScore : 100} />
      </ScoreBarWrapper>
      <ScorePercent>{myScore}</ScorePercent>
    </Container>
  );
}

export default MyScoreBar;
