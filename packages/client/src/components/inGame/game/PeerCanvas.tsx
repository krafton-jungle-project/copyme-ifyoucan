import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { peerAtom } from '../../../app/peer';
import { gameAtom, GameStage, peerPoseAtom } from '../../../app/game';
import { isStartAtom } from '../InGame';
import * as moveNet from '../../../utils/tfjs-movenet';
import { capturePose } from '../../../utils/capture-pose';

const Container = styled.div`
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  width: 100%;
  height: 80%;
  border-radius: 20px;
`;

const Video = styled.video`
  position: absolute;
  object-fit: cover;
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  /* visibility: hidden; */
  width: 100%;
  height: 100%;
  border-radius: 20px;
`;

const Canvas = styled.canvas`
  position: absolute;
  object-fit: cover;
  visibility: hidden;
  width: 100%;
  height: 100%;
  border-radius: 20px;
`;

const CapturedPose = styled.canvas`
  position: absolute;
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  object-fit: cover;
  width: 100%;
  height: 100%;
  border-radius: 20px;
`;

function PeerCanvas({ peerVideoRef }: { peerVideoRef: React.RefObject<HTMLVideoElement> }) {
  const videoRef = peerVideoRef;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const capturedPoseRef = useRef<HTMLCanvasElement>(null);

  const peer = useAtomValue(peerAtom);
  const game = useAtomValue(gameAtom);
  const isStart = useAtomValue(isStartAtom);
  const setPeerPose = useSetAtom(peerPoseAtom);

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
      const poses = await moveNet.detector.estimatePoses(moveNet.peerCamera.video);
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

  return (
    <Container>
      <Video ref={videoRef} />
      <Canvas ref={canvasRef} />
      <CapturedPose ref={capturedPoseRef} />
    </Container>
  );
}

export default PeerCanvas;
