import styled, { css, keyframes } from 'styled-components';
import { useEffect, useRef } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { peerInfoAtom } from '../../../app/peer';
import { gameAtom, GameStage, ItemType } from '../../../app/game';
import * as movenet from '../../../utils/tfjs-movenet';
import { capturePose } from '../../../utils/capture-pose';
import { useClientSocket } from '../../../module/client-socket';
import CountDown from './CountDown';
import Grade from './Grade';
import { roomInfoAtom } from '../../../app/room';

const Container = styled.div`
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  width: 100%;
  height: 80%;
  border-radius: 20px;
`;

const rotate = keyframes`
  0% {
    transform: scaleX(-1);
  }
  50% {
    transform: scaleX(1);
  }
  100% {
    transform: scaleX(-1);
  }
`;

const Video = styled.video<{ itemType: any; offender: boolean }>`
  position: absolute;
  object-fit: cover;
  transform: scaleX(-1);
  /* visibility: hidden; */
  width: 100%;
  height: 100%;
  border-radius: 20px;
  transition: 0.7s;

  ${(p) =>
    p.itemType === ItemType.BLUR &&
    p.offender &&
    css`
      filter: blur(30px);
    `}

  ${(p) =>
    p.itemType === ItemType.ROTATE &&
    p.offender &&
    css`
      animation: ${rotate} 1.5s infinite;
    `}

    ${(p) =>
    p.itemType === ItemType.SIZEDOWN &&
    p.offender &&
    css`
      transform: scale(0.5) scaleX(-1);
    `}
`;

const Canvas = styled.canvas`
  position: absolute;
  object-fit: cover;
  visibility: hidden;
  width: 100%;
  height: 100%;
  border-radius: 20px;
`;

const CapturedPose = styled.canvas<{ isCaptured: boolean; itemType: any; offender: boolean }>`
  position: absolute;
  object-fit: cover;
  transform: scaleX(-1);
  right: 0%;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 20px;
  visibility: hidden;

  border: 0.2rem solid #fff;
  box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #fff, 0 0 0.8rem #fff, 0 0 2.8rem #fff,
    inset 0 0 1.3rem #fff;

  transition: 0.7s;

  ${(p) =>
    p.isCaptured &&
    css`
      transform: scaleX(-1.2) scaleY(1.25);
      right: 10%;
    `}

  ${(p) =>
    p.itemType === ItemType.BLUR &&
    p.offender &&
    css`
      filter: blur(30px);
    `}

    ${(p) =>
    p.itemType === ItemType.ROTATE &&
    p.offender &&
    css`
      animation: ${rotate} 1.5s infinite;
    `}

    ${(p) =>
    p.itemType === ItemType.SIZEDOWN &&
    p.offender &&
    css`
      transform: scale(0.5) scaleX(-1);
    `}
`;

function PeerCanvas({ peerVideoRef }: { peerVideoRef: React.RefObject<HTMLVideoElement> }) {
  const videoRef = peerVideoRef;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const capturedPoseRef = useRef<HTMLCanvasElement>(null);

  const peerInfo = useAtomValue(peerInfoAtom);
  const [game, setGame] = useAtom(gameAtom);
  const host = useAtomValue(roomInfoAtom).host;
  const { socket } = useClientSocket();

  useEffect(() => {
    if (videoRef.current === null || canvasRef.current === null || peerInfo.stream === null) return;

    const elements = {
      video: videoRef.current,
      canvas: canvasRef.current,
    };

    movenet.peerCanvasRender({
      size: { width: 640, height: 480 },
      element: elements,
      peerStream: peerInfo.stream,
      canvasRender: false,
    });

    return () => {
      cancelAnimationFrame(movenet.peerRafId);
    };
  }, [videoRef, canvasRef, peerInfo.stream]);

  useEffect(() => {
    const getPeerPose = async () => {
      const poses = await movenet.detector.estimatePoses(movenet.peerCamera.video);
      setGame((prev) => ({ ...prev, peer: { ...prev.peer, pose: poses[0] } }));
    };

    // 카운트다운 0초일 때,
    if (game.countDown === 0) {
      // 공격 스테이지에서, 내가 수비자면 상대 공격을 캡쳐 또는
      // 수비 스테이지에서, 내가 공격자면 상대 수비를 캡쳐
      if (
        (game.stage === GameStage.OFFEND && !game.user.isOffender) ||
        (game.stage === GameStage.DEFEND && game.user.isOffender)
      ) {
        if (videoRef.current !== null && capturedPoseRef.current !== null) {
          // 내 수비 점수 확인을 위한 공격자(상대) 포즈 추정
          if (!game.user.isOffender) {
            getPeerPose();
          }

          // host 여부에 따라 소켓으로 이미지 전송 여부 결정
          if (host) {
            capturePose(
              videoRef.current,
              capturedPoseRef.current,
              game.user.isOffender ? 1 : 0,
              socket,
            );
          } else {
            capturePose(videoRef.current, capturedPoseRef.current);
          }

          capturedPoseRef.current.width = videoRef.current.width;
          capturedPoseRef.current.height = videoRef.current.height;
          capturedPoseRef.current.style.visibility = 'visible';
        }
      }
    }
  }, [game.countDown]);

  // 공수 비교 이펙트 끝나고 캡쳐 사진 감추고 다시 비디오 on
  useEffect(() => {
    if (capturedPoseRef.current && game.stage === GameStage.DEFEND && !game.isCaptured) {
      capturedPoseRef.current.style.visibility = 'hidden';
    }
  }, [game.isCaptured]);

  return (
    <Container>
      <Video ref={videoRef} itemType={game.item_type} offender={!game.user.isOffender} />
      <Canvas ref={canvasRef} />
      <CapturedPose
        ref={capturedPoseRef}
        isCaptured={game.isCaptured}
        itemType={game.item_type}
        offender={!game.user.isOffender}
      />
      {game.peer.gradable ? <Grade score={game.peer.score} isMe={false} /> : null}
      <CountDown isMe={false} />
    </Container>
  );
}

export default PeerCanvas;
