import { useEffect, useRef, useState } from 'react';
import * as moveNet from '../../utils/tfjs-movenet';
import styled from 'styled-components';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { peerAtom } from '../../app/peer';
import { gameAtom, GameStage, GameStatus, peerPoseAtom } from '../../app/game';
import { capturePose } from '../../utils/capture-pose';
import * as movenet from '../../utils/tfjs-movenet';
import PeerScoreBar from './PeerScoreBar';

const Container = styled.div`
  position: absolute;
  box-sizing: border-box;
  right: calc(100% * (1 / 8));
  width: calc(100% * (7 / 8));
  aspect-ratio: 4 / 3;
`;

const Video = styled.video`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  border: 5px solid blue;
  box-sizing: border-box;
  object-fit: cover;
  position: absolute;
  /* visibility: hidden; */
  width: 100%;
  height: 100%;
`;

const Canvas = styled.canvas<{ isStart: boolean }>`
  position: absolute;
  box-sizing: border-box;
  object-fit: cover;
  border: 5px solid blue;
  visibility: hidden;
  width: 100%;
  height: 100%;
`;

const CapturedPose = styled.canvas`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  border: 5px solid blue;
  box-sizing: border-box;
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

function PeerCanvas({ peerVideoRef }: { peerVideoRef: React.RefObject<HTMLVideoElement> }) {
  const videoRef = peerVideoRef;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const capturedPoseRef = useRef<HTMLCanvasElement>(null);

  const peer = useAtomValue(peerAtom);
  const game = useAtomValue(gameAtom);
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
    <Container>
      <Video ref={videoRef} />
      <Canvas isStart={isStart} ref={canvasRef} />
      <CapturedPose ref={capturedPoseRef} />
    </Container>
  );
}

export default PeerCanvas;
