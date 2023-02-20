import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { gameAtom, GameStage, GameStatus, myPoseAtom } from '../../app/game';
import { comparePoses } from '../../utils/pose-similarity';
import { detector } from '../../utils/tfjs-movenet';
import { useInterval } from './hooks/useInterval';

const Container = styled.div`
  position: absolute;
  background-color: blue;
  border: 5px solid blue;
  box-sizing: border-box;
  right: 0%;
  width: calc(100% * (1 / 8) * (4 / 5));
  aspect-ratio: 16/105;
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
  const myPose = useAtomValue(myPoseAtom);
  const [score, setScore] = useState(0);
  const [delay, setDelay] = useState<number | null>(null);
  const [isStart, setIsStart] = useState(false);
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
      if (game.stage !== GameStage.DEFEND_COUNTDOWN) {
        setDelay(null);
      }
      setScore(comparePoses(myPose, peerPose));
    }
  }, delay);

  useEffect(() => {
    if (game.isOffender && game.stage === GameStage.DEFEND_COUNTDOWN) {
      setDelay(500);
    }
  }, [game.isOffender, game.stage]);

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
      <ScoreBar isInit={isInit} isStart={isStart} score={isStart ? score : 100} />
    </Container>
  );
}

export default PeerScoreBar;
