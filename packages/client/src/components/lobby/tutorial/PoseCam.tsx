import type * as poseDetection from '@tensorflow-models/pose-detection';
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

const Announcement = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid red;
  height: 15%;
  width: 95%;
  font-size: 30px;
  font-weight: 700;
`;

function PoseCam() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [delay, setDelay] = useState<number | null>(null);
  const [content, setContent] = useState('튜토리얼에 오신 걸 환영합니다.');
  const [isBody, setIsBody] = useState(false);
  const [isLeft, setIsLeft] = useState(false);
  const [isRight, setIsRight] = useState(false);
  const [isT, setIsT] = useState(false);
  const [isSDR, setIsSDR] = useState(false);
  const [isPass, setIsPass] = useState(false);
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
    if (isPass && canvasRef.current) {
      setDelay(null);
      canvasRef.current.style.display = 'none';
      setContent('수고하셨습니다.');
      console.log('캔슬 했냐?');
      cancelAnimationFrame(movenet.myRafId);
    } else {
      setDelay(700);
    }
  }, [isPass]);

  useInterval(async () => {
    async function getMyPose(): Promise<poseDetection.Pose> {
      let pose: poseDetection.Pose;
      const poses = await movenet.detector.estimatePoses(movenet.myCamera.video);
      pose = poses[0];
      return pose;
    }

    let pose = await getMyPose();
    // if (!isBody) {
    //   setIsBody(isValidBody(pose));
    // }
    if (pose && !isBody) {
      if (!isLeft) {
        setContent(`왼손을 들어주세요.`);
        setIsLeft(isLeftHandUp(pose, 50));
      }
      if (isLeft && !isRight) {
        setContent('오른손을 들어주세요.');
        setIsRight(isRightHandUp(pose, 50));
      }
      if (isLeft && isRight && !isT) {
        setContent('양팔 벌려 서주세요.');
        setIsT(isTPose(pose, 65));
      }
      if (isLeft && isRight && isT && !isSDR) {
        setContent(`상상도 못한 포즈를 해주세요.`);
        setIsSDR(isSDRPose(pose, 70));
      }
      if (isLeft && isRight && isT && isSDR) {
        console.log('올패스 했냐?');
        setIsPass(true);
      }
    }
  }, delay);

  return (
    <>
      <Announcement>{content}</Announcement>
      <Video ref={videoRef}></Video>
      <Canvas ref={canvasRef}></Canvas>
    </>
  );
}

export default PoseCam;
