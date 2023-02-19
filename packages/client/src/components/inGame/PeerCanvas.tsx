import { useEffect, useRef } from 'react';
import * as moveNet from '../../utils/tfjs-movenet';
import styled from 'styled-components';
import { useAtomValue } from 'jotai';
import { peerAtom } from '../../app/peer';

const Video = styled.video`
  position: absolute;
  visibility: hidden;
  border: 5px solid blue;
  top: 20%;
  right: 7.5%;
  width: 35%;
  height: auto;
`;

const Canvas = styled.canvas`
  position: absolute;
  border: 5px solid blue;
  top: 20%;
  right: 10%;
  width: 35%;
  height: auto;
`;

function PeerCanvas() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const peer = useAtomValue(peerAtom);

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

  return (
    <>
      <Video ref={videoRef}></Video>
      <Canvas ref={canvasRef}></Canvas>
    </>
  );
}

export default PeerCanvas;
