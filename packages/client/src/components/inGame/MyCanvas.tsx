import { useEffect, useRef } from 'react';
import * as moveNet from '../../utils/tfjs-movenet';
import styled from 'styled-components';

const Video = styled.video`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  object-fit: cover;
  position: absolute;
  visibility: hidden;
  width: 100%;
  height: 100%;
`;

const Canvas = styled.canvas`
  position: relative;
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

const Container = styled.div`
  position: absolute;
  box-sizing: border-box;
  border: 5px solid red;
  top: 20%;
  left: 10%;
  width: 35%;
  aspect-ratio: 4/3;
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
    <Container>
      <Video ref={videoRef}></Video>
      <Canvas ref={canvasRef}></Canvas>
    </Container>
  );
}

export default MyCanvas;
