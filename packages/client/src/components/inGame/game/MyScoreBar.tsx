import styled, { css, keyframes } from 'styled-components';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { GameStage, gameAtom } from '../../../app/game';
import { comparePoses } from '../../../utils/pose-similarity';
import { useInterval } from '../hooks/useInterval';
import { useClientSocket } from '../../../module/client-socket';
import { useMovenetStream } from '../../../module/movenet-stream';

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
  background-color: rgba(0, 0, 0, 0.3);
  border: 0.2rem solid #fff;
  border-radius: 20px;
  box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #ff3131, 0 0 0.8rem #ff3131,
    0 0 2.8rem #ff3131, inset 0 0 1.3rem #ff3131;
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
  transition: ${(props) => (props.isInit ? 'height 1.5s linear 1.2s' : 'height 0.5s linear')};
  background-color: ${(props) => (props.score > 60 ? '#ff3131' : '#888')};
  border-radius: 20px;
  ${(props) =>
    (props.isInit || (props.score > 60 && props.isDefense)) &&
    css`
      background-color: #ff3131;
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
  color: #ff3131;
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
  color: #ff3131;
`;

function MyScoreBar({ myVideoRef }: { myVideoRef: React.RefObject<HTMLVideoElement> }) {
  const [game, setGame] = useAtom(gameAtom);
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
      const tempScore = comparePoses(myPose, game.peer.pose);
      socket.emit('score', tempScore);
      setGame((prev) => ({
        ...prev,
        user: { ...prev.user, score: tempScore },
      }));
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
      <ScorePercent>{game.user.score}</ScorePercent>
      <ScoreBarWrapper>
        <ScoreBar
          isInit={game.stage === GameStage.INITIAL}
          score={game.isStart ? game.user.score : 100}
          isDefense={!game.user.isOffender && game.stage === GameStage.DEFEND}
        />
      </ScoreBarWrapper>
      <ScoreInfo>유사도</ScoreInfo>
    </Container>
  );
}

export default MyScoreBar;
