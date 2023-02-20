import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { gameAtom, GameStage, peerPoseAtom } from '../../app/game';
import { comparePoses } from '../../utils/pose-similarity';
import { detector } from '../../utils/tfjs-movenet';

const Container = styled.div`
  position: absolute;
  background-color: red;
  box-sizing: border-box;
  left: 0%;
  width: calc(100% * (1 / 8) * (4 / 5));
  aspect-ratio: 16/105;
`;

const ScoreBar = styled.div<{ score: number }>`
  background-color: gray;
  width: 100%;
  height: ${(props) => `${(100 - props.score).toString()}%`};
  transition-property: height;
  transition-duration: 0.5s;
`;

function MyScoreBar({ myVideoRef }: { myVideoRef: React.RefObject<HTMLVideoElement> }) {
  // const [score, setScore] = useState(0);
  // const game = useAtomValue(gameAtom);
  // const peerPose = useAtomValue(peerPoseAtom);

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

  return (
    <Container>
      <ScoreBar score={50} />
    </Container>
  );
}

export default MyScoreBar;
