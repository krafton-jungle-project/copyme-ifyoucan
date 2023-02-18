import { useEffect, useState } from 'react';
import { comparePoses } from '../../utils/pose-similarity';
import type * as poseDetection from '@tensorflow-models/pose-detection';
import styled from 'styled-components';
import getPose from '../../utils/get-pose';

const Score = styled.div`
  width: 150px;
  height: 150px;
  font-size: 100px;
  text-align: center;
`;

function PrintScore() {
  const [score, setScore] = useState(0);

  useEffect(() => {
    let pose: poseDetection.Pose | undefined;

    async function renderingPose() {
      pose = await getPose();
      if (pose !== undefined) {
        let s = Math.ceil(100 - 100 * comparePoses(pose, pose));
        setScore(s > 0 ? s : 0);
      }
    }

    setInterval(() => {
      renderingPose();
    }, 1000);
  }, []);
  return (
    <>
      <Score>{score}</Score>
    </>
  );
}

export default PrintScore;
