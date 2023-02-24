import type * as poseDetection from '@tensorflow-models/pose-detection';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as movenet from '../../../utils/tfjs-movenet';
import { useInterval } from '../../inGame/hooks/useInterval';

const Video = styled.video`
  position: absolute;
  object-fit: cover;
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  visibility: hidden;
  width: 100%;
  height: 100%;
  border-radius: 20px;
`;

const Canvas = styled.canvas`
  position: absolute;
  object-fit: cover;
  /* visibility: hidden; */
  width: 100%;
  height: 100%;
  border-radius: 25px 5px;
`;

async function getMyPose(): Promise<poseDetection.Pose> {
  let pose: poseDetection.Pose;
  const poses = await movenet.detector.estimatePoses(movenet.myCamera.video);
  pose = poses[0];
  return pose;
}

function PoseCam() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (videoRef.current && canvasRef.current) {
      const elements = {
        video: videoRef.current,
        canvas: canvasRef.current,
      };

      movenet.myCanvasRender({
        size: { width: 680, height: 480 },
        element: elements,
      });
    }
    // return () => {
    //   cancelAnimationFrame(movenet.myRafId);
    // };
  }, []);

  return (
    <>
      <Video ref={videoRef}></Video>
      <Canvas ref={canvasRef}></Canvas>
    </>
  );
}

export default PoseCam;
