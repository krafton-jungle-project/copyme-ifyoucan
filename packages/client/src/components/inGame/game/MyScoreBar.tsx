import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { gameAtom, GameStage, GameStatus, peerPoseAtom } from '../../../app/game';
import { comparePoses } from '../../../utils/pose-similarity';
import { detector } from '../../../utils/tfjs-movenet';
import { useInterval } from '../hooks/useInterval';

const Container = styled.div`
  position: absolute;
  background-color: red;
  border: 5px solid red;
  box-sizing: border-box;
  left: calc(100% * (7 / 8) + 100% * (1 / 8) * (1 / 5));
  width: calc(100% * (1 / 8) * (4 / 5));
  height: 100%;
`;

const ScoreBar = styled.div<{ isInit: boolean; isStart: boolean; score: number }>`
  background-color: #a66868;
  width: 100%;
  height: ${(props) => `${(100 - props.score).toString()}%`};
  transition-property: height;
  transition-delay: ${(props) => (props.isInit ? '1.2s' : '0s')};
  transition-duration: ${(props) => (props.isInit ? '0.7s' : '0.5s')};
`;

function MyScoreBar({ myVideoRef }: { myVideoRef: React.RefObject<HTMLVideoElement> }) {
  const game = useAtomValue(gameAtom);
  const peerPose = useAtomValue(peerPoseAtom);
  const [score, setScore] = useState(0);
  const [delay, setDelay] = useState<number | null>(null);
  const [isStart, setIsStart] = useState(false);
  const [isInit, setIsInit] = useState(true);

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
      setScore(comparePoses(myPose, peerPose));
      console.log('상대 방어');
    }
  }, delay);

  useEffect(() => {
    if (!game.isOffender && game.stage === GameStage.DEFEND_COUNTDOWN) {
      setDelay(500);
    } else {
      if (game.stage !== GameStage.DEFEND_COUNTDOWN) {
        setDelay(null);
      }
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

export default MyScoreBar;
