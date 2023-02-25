import type * as poseDetection from '@tensorflow-models/pose-detection';
import { useAtom, useSetAtom } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as movenet from '../../../utils/tfjs-movenet';
import {
  isLeftHandUp,
  isRightHandUp,
  isSDRPose,
  isTPose,
  isValidBody,
} from '../../common/PoseRecognition';
import { useInterval } from '../../inGame/hooks/useInterval';
import {
  isBodyAtom,
  isLeftAtom,
  isRightAtom,
  isSDRAtom,
  isStartedAtom,
  isTPoseAtom,
  tutorialContentAtom,
  tutorialImgAtom,
  tutorialPassAtom,
} from '../../../app/tutorial';

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
  /* position: absolute; */
  object-fit: cover;
  /* visibility: hidden; */
  width: 95%;
  height: 100%;
  border-radius: 25px 5px;
`;

function PoseCam() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [delay, setDelay] = useState<number | null>(null);

  const [isStarted, setIsStarted] = useAtom(isStartedAtom);
  const [isBody, setIsBody] = useAtom(isBodyAtom);
  const [isLeft, setIsLeft] = useAtom(isLeftAtom);
  const [isRight, setIsRight] = useAtom(isRightAtom);
  const [isT, setIsT] = useAtom(isTPoseAtom);
  const [isSDR, setIsSDR] = useAtom(isSDRAtom);
  const [isPass, setIsPass] = useAtom(tutorialPassAtom);
  const setContent = useSetAtom(tutorialContentAtom);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) {
      return;
    }

    const elements = {
      video: videoRef.current,
      canvas: canvasRef.current,
    };

    movenet.myCanvasRender({
      size: { width: 680, height: 480 },
      element: elements,
    });

    return () => {
      cancelAnimationFrame(movenet.myRafId);
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      if (!isStarted) {
        setDelay(null);
        canvasRef.current.style.display = 'none';
      } else {
        canvasRef.current.style.display = 'block';
        setDelay(1000);
      }

      if (isPass) {
        setDelay(null);
        canvasRef.current.style.display = 'none';
        cancelAnimationFrame(movenet.myRafId);
      }
    }
  }, [isStarted, isPass]);

  useInterval(async () => {
    async function getMyPose(): Promise<poseDetection.Pose> {
      let pose: poseDetection.Pose;
      const poses = await movenet.detector.estimatePoses(movenet.myCamera.video);
      pose = poses[0];
      return pose;
    }

    let pose = await getMyPose();

    if (!isStarted) {
      setContent(`마리오를 눌러 튜토리얼을 시작하세요.`);
      console.log(`시작 안했는데?`);
    }

    if (isStarted && !isBody) {
      setContent(`전신이 나오게 서주세요.`);
      setIsBody(isValidBody(pose));
      console.log(`왜 시작함?`);
    }

    if (pose && isBody) {
      if (!isLeft) {
        setIsLeft(isLeftHandUp(pose, 50));
      }
      if (isLeft && !isRight) {
        setIsRight(isRightHandUp(pose, 50));
      }
      if (isLeft && isRight && !isT) {
        setIsT(isTPose(pose, 65));
      }
      if (isLeft && isRight && isT && !isSDR) {
        setIsSDR(isSDRPose(pose, 70));
      }
      if (isLeft && isRight && isT && isSDR) {
        setIsPass(true);
      }
    }
  }, delay);

  return (
    <>
      <Video ref={videoRef}></Video>
      <Canvas ref={canvasRef}></Canvas>
    </>
  );
}

export default PoseCam;
