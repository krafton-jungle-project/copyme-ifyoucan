import styled from 'styled-components';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { gameAtom, GameStage, GameStatus, myPoseAtom } from '../../../app/game';
import { comparePoses } from '../../../utils/pose-similarity';
import { detector } from '../../../utils/tfjs-movenet';
import { useInterval } from '../hooks/useInterval';
import { isStartAtom } from '../InGame';

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
  const myPose = useAtomValue(myPoseAtom);
  const [score, setScore] = useState(0);
  const [delay, setDelay] = useState<number | null>(null);
  const isStart = useAtomValue(isStartAtom);
  const [isInit, setIsInit] = useState(true);

  const getPeerPose = async () => {
    if (peerVideoRef.current) {
      const myPoses = await detector.estimatePoses(peerVideoRef.current);
      if (myPoses && myPoses.length > 0) {
        return myPoses[0];
      }
    }
  };

  useInterval(async () => {
    const peerPose = await getPeerPose();
    if (myPose && peerPose) {
      setScore(comparePoses(myPose, peerPose));
    }
  }, delay);

  useEffect(() => {
    if (game.isOffender && game.stage === GameStage.DEFEND_COUNTDOWN) {
      setDelay(500);
    } else {
      if (game.stage !== GameStage.DEFEND_COUNTDOWN) {
        setDelay(null);
      }
    }
  }, [game.isOffender, game.stage]);

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
        <ScoreBar isInit={isInit} score={isStart ? score : 100} />
      </ScoreBarWrapper>
      <ScorePercent>{score}</ScorePercent>
    </Container>
  );
}

export default PeerScoreBar;
