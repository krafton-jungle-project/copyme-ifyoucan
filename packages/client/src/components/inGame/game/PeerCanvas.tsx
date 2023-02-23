import styled, { css } from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { peerAtom } from '../../../app/peer';
import { countDownAtom, gameAtom, GameStage, peerPoseAtom } from '../../../app/game';
import * as moveNet from '../../../utils/tfjs-movenet';
import { capturePose } from '../../../utils/capture-pose';
import { imHostAtom } from '../../../app/atom';
import { useClientSocket } from '../../../module/client-socket';
import CountDown from './CountDown';
import Grade from './Grade';

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
  border-radius: 10px 25px;
`;

const Canvas = styled.canvas`
  position: absolute;
  object-fit: cover;
  visibility: hidden;
  width: 100%;
  height: 100%;
  border-radius: 20px;
`;

const CapturedPose = styled.canvas<{ isCaptured: boolean }>`
  visibility: hidden;
  object-fit: cover;
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  position: absolute;
  width: 100%;
  height: 100%;
  outline: 7px solid;
  border-radius: 20px;
  ${(props) =>
    props.isCaptured &&
    css`
      /* -webkit-transform: scaleX(-1)                                                                                 ;
      transform: scaleX(-1); */
      position: absolute;
      transform: scaleX(-1) scale(1.3);
      right: 10%;
      transition: 0.7s;
    `}

  ${(props) =>
    !props.isCaptured &&
    css`
      position: absolute;
      transform: scaleX(-1) scale(1);
      right: 0%;
      transition: 0.7s;
    `}
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
  const [isCaptured, setIsCaptured] = useState(false);
  const [gradable, setGradable] = useState(false);

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

          // host 여부에 따라 소켓으로 이미지 전송 여부 결정
          if (host) {
            capturePose(videoRef.current, capturedPoseRef.current, game.isOffender ? 1 : 0, socket);
          } else {
            capturePose(videoRef.current, capturedPoseRef.current);
          }

          capturedPoseRef.current.width = videoRef.current.width;
          capturedPoseRef.current.height = videoRef.current.height;
          capturedPoseRef.current.style.visibility = 'visible';
        }
      }

      //todo: 캡쳐한 수비사진을, 공격자의 캡쳐한 사진과 짧게 비교
      if (game.stage === GameStage.DEFEND) {
        //todo: 공수 비교 이펙트
        setIsCaptured(true);

        if (game.isOffender) {
          setTimeout(() => {
            setGradable(true);
          }, 1000);
        }
        setTimeout(() => {
          if (videoRef.current !== null && capturedPoseRef.current !== null) {
            //todo: 공수 비교 이펙트 끝나고 다시 사진 감추기
            capturedPoseRef.current.style.visibility = 'hidden';
            setIsCaptured(false);
            setGradable(false);
          }
        }, 2000);
      }
    }
  }, [countDown]);

  return (
    <Container>
      <Video ref={videoRef} />
      <Canvas ref={canvasRef} />
      <CapturedPose ref={capturedPoseRef} isCaptured={isCaptured} />
      {gradable ? <Grade score={peer.score} isMine={false} /> : null}
      <CountDown isMe={false} />
    </Container>
  );
}

export default PeerCanvas;
