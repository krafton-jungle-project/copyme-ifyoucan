import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import * as moveNet from '../../utils/tfjs-movenet';
import Capture from '../../utils/capture-pose';

const CanvasWrapper = styled.div`
  position: relative;
`;

const Video = styled.video`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  position: absolute;
`;

const Canvas = styled.canvas`
  position: absolute;
`;

const Button = styled.button`
  margin: 2px;
`;

const Canvas2 = styled.canvas<{ visible: any }>`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
`;

function MyVideo() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef2 = useRef<HTMLCanvasElement>(null);
  const captureBtnRef = useRef<HTMLButtonElement>(null);

  const [visibility, setVisibility] = useState<boolean>(true);

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

    return () => {
      cancelAnimationFrame(moveNet.rafId);
    };
  }, []);

  function onClickCapture() {
    if (canvasRef2.current !== null && videoRef.current !== null) {
      Capture(canvasRef2.current, videoRef.current, 640, 480);
    }
    setVisibility(true);
  }

  function onClickCancel() {
    setVisibility(false);
    console.log('click cancel');
  }

  return (
    <div>
      <CanvasWrapper ref={wrapperRef}>
        <Video ref={videoRef}></Video>
        <Canvas ref={canvasRef}></Canvas>
        <Canvas2 visible={visibility} ref={canvasRef2}></Canvas2>
      </CanvasWrapper>
      <Button ref={captureBtnRef} onClick={onClickCapture}>
        캡처!
      </Button>
      <Button onClick={onClickCancel}>취소</Button>
    </div>
  );
}

export default MyVideo;
