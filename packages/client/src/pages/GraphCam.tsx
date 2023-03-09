import { useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { gCanvasRefAtom, gVideoRefAtom } from '../types/graph';
import * as movenet from '../utils/tfjs-movenet';

const Container = styled.div`
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  width: 100%;
  height: 100%;
`;

const Video = styled.video`
  position: absolute;
  object-fit: cover;
  visibility: hidden;
`;

const Canvas = styled.canvas`
  object-fit: cover;
  width: 100%;
  height: 100%;
  border-radius: 5px;
`;

function GraphCam() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [, setgvideo] = useAtom(gVideoRefAtom);
  const [, setgcanvas] = useAtom(gCanvasRefAtom);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    setgvideo(videoRef.current);
    setgcanvas(canvasRef.current);

    const elements = {
      video: videoRef.current,
      canvas: canvasRef.current,
    };

    movenet.myCanvasRender({
      size: { width: 680, height: 480 },
      element: elements,
      canvasRender: true,
    });

    return () => {
      cancelAnimationFrame(movenet.myRafId);
    };
  }, []);
  return (
    <Container>
      <Video ref={videoRef} />
      <Canvas ref={canvasRef} />
    </Container>
  );
}

export default GraphCam;
