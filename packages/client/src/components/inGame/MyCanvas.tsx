import { useEffect, useRef } from 'react';
import * as moveNet from '../../utils/tfjs-movenet';
import styled from 'styled-components';

const Video = styled.video`
  position: absolute;
  visibility: hidden;
`;

const Canvas = styled.canvas`
  position: absolute;
  border: 5px solid blue;
  top: 20%;
  left: 10%;
  width: 35%;
  height: auto;
`;

function MyCanvas() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

  return (
    <>
      <Video ref={videoRef}></Video>
      <Canvas ref={canvasRef}></Canvas>
    </>
  );
}

export default MyCanvas;
