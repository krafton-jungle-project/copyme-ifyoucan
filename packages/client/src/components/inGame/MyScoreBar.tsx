import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { gameAtom, GameStage, GameStatus, peerPoseAtom } from '../../app/game';
import { comparePoses } from '../../utils/pose-similarity';
import { detector } from '../../utils/tfjs-movenet';

const Container = styled.div`
  position: absolute;
  background-color: red;
  border: 5px solid red;
  box-sizing: border-box;
  left: 0%;
  width: calc(100% * (1 / 8) * (4 / 5));
  aspect-ratio: 16/105;
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
  // const [score, setScore] = useState(0);
  const game = useAtomValue(gameAtom);
  const [isStart, setIsStart] = useState(false);
  const [isInit, setIsInit] = useState(true);
  // const peerPose = useAtomValue(peerPoseAtom);
  let score = 0; //temp

  // useEffect(() => {
  //   const getMyPose = async () => {
  //     if (myVideoRef.current) {
  //       const myPoses = await detector.estimatePoses(myVideoRef.current);
  //       if (myPoses && myPoses.length > 0) {
  //         return myPoses[0];
  //       }
  //     }
  //   };

  //   const getMyScore = async () => {
  //     const myPose = await getMyPose();
  //     if (myPose && peerPose) {
  //       setScore(comparePoses(myPose, peerPose));
  //     }
  //   };

  //   let intervalId;

  //   if (!game.isOffender && game.stage === GameStage.DEFEND_COUNTDOWN) {
  //     intervalId = setInterval(getMyScore, 500);
  //   } else {
  //     clearInterval(intervalId);
  //   }
  // }, [game.stage]);

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
