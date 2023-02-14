import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import * as moveNet from '../utils/tfjs-movenet';

const CanvasWrapper = styled.div`
  position: relative;
`;

const Video = styled.video`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  position: absolute;
`;

const Canvas = styled.canvas`
  position: relative;
`;

function MyVideo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (videoRef.current === null || canvasRef.current === null || wrapperRef.current === null)
      return;

    const elements = {
      wrapper: wrapperRef.current,
      video: videoRef.current,
      canvas: canvasRef.current,
    };

    moveNet.canvasRender({
      size: { width: 640, height: 480 },
      element: elements,
    });
  }, []);

  return (
    <CanvasWrapper ref={wrapperRef}>
      <Video ref={videoRef}></Video>
      <Canvas ref={canvasRef}></Canvas>
    </CanvasWrapper>
  );
}

export default MyVideo;
