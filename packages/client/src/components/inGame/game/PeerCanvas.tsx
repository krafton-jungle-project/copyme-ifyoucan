import styled from 'styled-components';
import { useEffect, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { peerAtom } from '../../../app/peer';
import { countDownAtom, gameAtom, GameStage, peerPoseAtom } from '../../../app/game';
import * as moveNet from '../../../utils/tfjs-movenet';
import { capturePose } from '../../../utils/capture-pose';
import { imHostAtom } from '../../../app/atom';
import { useClientSocket } from '../../../module/client-socket';

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
  const host = useAtomValue(imHostAtom);
  const setPeerPose = useSetAtom(peerPoseAtom);
  const { socket } = useClientSocket();
  const countDown = useAtomValue(countDownAtom);

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
      setPeerPose(poses[0]);
    };

    // 카운트다운 0초일 때,
    if (countDown === 0) {
      // 공격 스테이지에서, 내가 수비자면 상대 공격을 캡쳐 또는
      // 수비 스테이지에서, 내가 공격자면 상대 수비를 캡쳐
      if (
        (game.stage === GameStage.OFFEND && !game.isOffender) ||
        (game.stage === GameStage.DEFEND && game.isOffender)
      ) {
        if (videoRef.current !== null && capturedPoseRef.current !== null) {
          // 내 수비 점수 확인을 위한 공격자(상대) 포즈 추정
          if (!game.isOffender) {
            getPeerPose();
          }

          //todo: 제희만 믿는다...2
          if (host) {
            capturePose(videoRef.current, capturedPoseRef.current, game.isOffender ? 1 : 0, socket);
          } else {
            capturePose(videoRef.current, capturedPoseRef.current, game.isOffender ? 1 : 0);
          }

          capturedPoseRef.current.width = videoRef.current.width;
          capturedPoseRef.current.height = videoRef.current.height;
          capturedPoseRef.current.style.visibility = 'visible';
        }
      }

      //todo: 캡쳐한 수비사진을, 공격자의 캡쳐한 사진과 짧게 비교
      if (game.stage === GameStage.DEFEND) {
        //todo: 공수 비교 이펙트
        setTimeout(() => {
          if (videoRef.current !== null && capturedPoseRef.current !== null) {
            //todo: 공수 비교 이펙트 끝나고 다시 사진 감추기
            capturedPoseRef.current.style.visibility = 'hidden';
          }
        }, 1000);
      }
    }
  }, [countDown]);

  return (
    <Container>
      <Video ref={videoRef} />
      <Canvas ref={canvasRef} />
      <CapturedPose ref={capturedPoseRef} />
    </Container>
  );
}

export default PeerCanvas;
