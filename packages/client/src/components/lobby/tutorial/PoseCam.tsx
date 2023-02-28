import type * as poseDetection from '@tensorflow-models/pose-detection';
import { useAtom, useAtomValue } from 'jotai';
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
  tutorialPassAtom,
} from '../../../app/tutorial';
import { Correct } from '../../../utils/sound';

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const Video = styled.video`
  position: absolute;
  visibility: hidden;
`;

const Canvas = styled.canvas`
  object-fit: cover;
  width: 100%;
  height: 100%;
  border-radius: 5px;
`;

function PoseCam() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [delay, setDelay] = useState<number | null>(null);

  const isStarted = useAtomValue(isStartedAtom);
  const [isBody, setIsBody] = useAtom(isBodyAtom);
  const [isLeft, setIsLeft] = useAtom(isLeftAtom);
  const [isRight, setIsRight] = useAtom(isRightAtom);
  const [isT, setIsT] = useAtom(isTPoseAtom);
  const [isSDR, setIsSDR] = useAtom(isSDRAtom);
  const [isPass, setIsPass] = useAtom(tutorialPassAtom);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const elements = {
      video: videoRef.current,
      canvas: canvasRef.current,
    };

    movenet.myCanvasRender({
      size: { width: 680, height: 480 },
      element: elements,
      canvasRender: true,
    });

    return () => {
      cancelAnimationFrame(movenet.myRafId);
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      if (!isStarted) {
        setDelay(null);
      } else {
        setDelay(1000);
      }

      if (isPass) {
        setDelay(null);
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
    let soundFlag: boolean;

    if (isStarted && !isBody) {
      soundFlag = isValidBody(pose);
      if (soundFlag) Correct.play();
      setIsBody(soundFlag);
    }

    if (isStarted && pose && isBody) {
      if (!isLeft) {
        soundFlag = isLeftHandUp(pose, 50);
        if (soundFlag) Correct.play();
        setIsLeft(isLeftHandUp(pose, 50));
      }
      if (isLeft && !isRight) {
        soundFlag = isRightHandUp(pose, 50);
        if (soundFlag) Correct.play();
        setIsRight(soundFlag);
      }
      if (isLeft && isRight && !isT) {
        soundFlag = isTPose(pose, 65);
        if (soundFlag) Correct.play();
        setIsT(soundFlag);
      }
      if (isLeft && isRight && isT && !isSDR) {
        soundFlag = isSDRPose(pose, 70);
        if (soundFlag) Correct.play();
        setIsSDR(soundFlag);
      }
      if (isLeft && isRight && isT && isSDR) {
        setIsPass(true);
      }
    }
  }, delay);

  return (
    <Container>
      <Video ref={videoRef}></Video>
      <Canvas ref={canvasRef}></Canvas>
    </Container>
  );
}

export default PoseCam;
