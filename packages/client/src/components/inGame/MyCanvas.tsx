import { useEffect, useRef } from 'react';
import * as moveNet from '../../utils/tfjs-movenet';
import styled from 'styled-components';
import { useAtomValue, useSetAtom } from 'jotai';
import { gameAtom, GameStage, myPoseAtom } from '../../app/game';
import { capturePose } from '../../utils/capture-pose';
import * as movenet from '../../utils/tfjs-movenet';
import { hostAtom } from '../../app/atom';
import { useClientSocket } from '../../module/client-socket';

const Container = styled.div`
  position: absolute;
  box-sizing: border-box;
  left: 0%;
  width: calc(100% * (7 / 8));
  height: 100%;
`;

const Video = styled.video`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  position: absolute;
  border: 5px solid red;
  box-sizing: border-box;
  object-fit: cover;
  /* visibility: hidden; */
  width: 100%;
  height: 100%;
`;

const Canvas = styled.canvas`
  position: absolute;
  border: 5px solid red;
  box-sizing: border-box;
  object-fit: cover;
  visibility: hidden;
  width: 100%;
  height: 100%;
`;

const CapturedPose = styled.canvas`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  border: 5px solid red;
  box-sizing: border-box;
  object-fit: cover;
  position: absolute;
  width: 100%;
  height: 100%;
`;

function MyCanvas({ myVideoRef }: { myVideoRef: React.RefObject<HTMLVideoElement> }) {
  const videoRef = myVideoRef;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const capturedPoseRef = useRef<HTMLCanvasElement>(null);

  const game = useAtomValue(gameAtom);
  const setMyPose = useSetAtom(myPoseAtom);
  const host = useAtomValue(hostAtom);
  const { socket } = useClientSocket();

  useEffect(() => {
    if (videoRef.current === null || canvasRef.current === null) return;

    const elements = {
      video: videoRef.current,
      canvas: canvasRef.current,
    };

    moveNet.myCanvasRender({
      size: { width: 640, height: 480 },
      element: elements,
    });

    return () => {
      cancelAnimationFrame(moveNet.myRafId);
    };
  }, []);

  useEffect(() => {
    const getMyPose = async () => {
      const poses = await movenet.detector.estimatePoses(movenet.myCamera.video);
      setMyPose(poses[0]);
    };

    if (game.isOffender && game.stage === GameStage.DEFEND_ANNOUNCEMENT) {
      if (videoRef.current !== null && capturedPoseRef.current !== null) {
        capturedPoseRef.current.style.visibility = 'visible';

        getMyPose();
        capturePose(videoRef.current, capturedPoseRef.current, 0); //temp

        capturedPoseRef.current.width = videoRef.current.width;
        capturedPoseRef.current.height = videoRef.current.height;
      }
    } else if (
      game.stage !== GameStage.DEFEND_ANNOUNCEMENT &&
      game.stage !== GameStage.DEFEND_COUNTDOWN
    ) {
      if (capturedPoseRef.current !== null) {
        capturedPoseRef.current.style.visibility = 'hidden';
      }
    }

    if (!game.isOffender && game.stage === GameStage.OFFEND_ANNOUNCEMENT) {
      if (videoRef.current !== null && capturedPoseRef.current !== null) {
        if (host) {
          capturePose(videoRef.current, capturedPoseRef.current, 1, socket);
        } else {
          capturePose(videoRef.current, capturedPoseRef.current, 1);
        }
        capturedPoseRef.current.style.visibility = 'hidden'; // 임시로 사진 보내고 바로 가려버림
      }
    }
  }, [game.stage]);

  return (
    <Container>
      <Video ref={videoRef}></Video>
      <Canvas ref={canvasRef}></Canvas>
      <CapturedPose ref={capturedPoseRef} />
    </Container>
  );
}

export default MyCanvas;
