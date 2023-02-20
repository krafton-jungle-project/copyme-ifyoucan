import { useEffect, useRef, useState } from 'react';
import * as moveNet from '../../utils/tfjs-movenet';
import styled from 'styled-components';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { peerAtom } from '../../app/peer';
import { gameAtom, GameStage, GameStatus, peerPoseAtom } from '../../app/game';
import { capturePose } from '../../utils/capture-pose';
import * as movenet from '../../utils/tfjs-movenet';
import PeerScoreBar from './PeerScoreBar';

const Container = styled.div<{ isStart: boolean }>`
  position: absolute;
  box-sizing: border-box;
  border: 5px solid blue;
  top: 20%;
  right: ${(props) => (props.isStart ? '5%' : '-40%')};
  width: 40%; /* 35% * (8 / 7) */
  aspect-ratio: 32/21; /* 4 * (8 / 7) : 3 */
  transition-property: right;
  transition-delay: 0.5s;
  transition-duration: 0.5s;
`;

const Video = styled.video`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  object-fit: cover;
  position: absolute;
  /* visibility: hidden; */
  right: calc(100% * (1 / 8));
  width: calc(100% * (7 / 8));
  height: 100%;
`;

const Canvas = styled.canvas`
  position: absolute;
  object-fit: cover;
  visibility: hidden;
  right: calc(100% * (1 / 8));
  width: calc(100% * (7 / 8));
  height: 100%;
`;

const CapturedPose = styled.canvas`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  position: absolute;
  object-fit: cover;
  right: calc(100% * (1 / 8));
  width: calc(100% * (7 / 8));
  height: 100%;
`;

function PeerCanvas() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const capturedPoseRef = useRef<HTMLCanvasElement>(null);

  const peer = useAtomValue(peerAtom);
  const [game, setGame] = useAtom(gameAtom);
  const setPeerPose = useSetAtom(peerPoseAtom);
  const [isStart, setIsStart] = useState(false);

  useEffect(() => {
    if (videoRef.current === null || canvasRef.current === null || peer.stream === null) return;

    const elements = {
      video: videoRef.current,
      canvas: canvasRef.current,
    };
    moveNet.peerCanvasRender({
      size: { width: 640, height: 480 },
      element: elements,
      peerStream: peer.stream,
    });

    canvasRef.current.width = 640;
    canvasRef.current.height = 480;

    return () => {
      cancelAnimationFrame(moveNet.peerRafId);
    };
  }, [peer.stream]);

  useEffect(() => {
    const getPeerPose = async () => {
      const poses = await movenet.detector.estimatePoses(movenet.peerCamera.video);
      // setGame((prev) => ({ ...prev, capturedPose: poses[0] }));
      setPeerPose(poses[0]);
    };

    if (!game.isOffender && game.stage === GameStage.DEFEND_ANNOUNCEMENT) {
      if (videoRef.current !== null && capturedPoseRef.current !== null) {
        capturedPoseRef.current.style.visibility = 'visible';

        getPeerPose();
        capturePose(videoRef.current, capturedPoseRef.current); //temp

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
  }, [game.stage]);

  useEffect(() => {
    setIsStart(game.status !== GameStatus.WAITING);
  }, [game.status]);

  return (
    <Container isStart={isStart}>
      <Video ref={videoRef} />
      <Canvas ref={canvasRef} />
      <CapturedPose ref={capturedPoseRef} />
      <PeerScoreBar peerVideoRef={videoRef} />
    </Container>
  );
}

export default PeerCanvas;
