import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as moveNet from '../../utils/tfjs-movenet';
import Capture from '../../utils/capture-pose';

const CanvasWrapper = styled.div`
  position: relative;
  margin-bottom: 3px;
`;

const Video = styled.video`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  position: absolute;
`;

const Canvas = styled.canvas`
  position: absolute;
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
      size: { width: 400, height: 300 }, // TODO: 임시 수정
      element: elements,
    });

    return () => {
      cancelAnimationFrame(moveNet.rafId);
    };
  }, []);

  return (
    <div>
      <CanvasWrapper ref={wrapperRef}>
        <Video ref={videoRef}></Video>
        <Canvas ref={canvasRef}></Canvas>
      </CanvasWrapper>
    </div>
  );
}

export default MyVideo;
