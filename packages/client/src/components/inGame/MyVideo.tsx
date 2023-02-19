import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { stream } from '../../utils/tfjs-movenet';

const Video = styled.video`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  position: absolute;
  box-sizing: border-box;
  border: 5px solid red;
  bottom: 5%;
  left: 5%;
  width: 15%;
  aspect-ratio: 4/3;
`;

function MyVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, []);

  return <Video ref={videoRef} autoPlay></Video>;
}

export default MyVideo;
