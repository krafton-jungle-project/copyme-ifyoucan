import { useEffect, useState } from 'react';
import { comparePoses } from '../utils/pose-similarity';
import * as poseDetection from '@tensorflow-models/pose-detection';
import * as movenet from '../utils/tfjs-movenet';
import styled from 'styled-components';

const Score = styled.div`
  width: 150px;
  height: 150px;
  font-size: 100px;
  text-align: center;
`;

function PrintScore() {
  const [score, setScore] = useState(0);

  useEffect(() => {
    let pose: poseDetection.Pose;
    async function b() {
      const poses = await movenet.detector.estimatePoses(movenet.camera.video);
      if (poses && poses.length > 0) {
        pose = poses[0];
        let s = Math.ceil(100 - 100 * comparePoses(pose, pose));
        setScore(s > 0 ? s : 0);
      }
    }
    setInterval(() => {
      b();
    }, 1000);
  }, []);
  return (
    <>
      <Score>{score}</Score>
    </>
  );
}

export default PrintScore;
