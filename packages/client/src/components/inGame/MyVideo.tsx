import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { stream } from '../../utils/tfjs-movenet';

const Video = styled.video`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  position: absolute;
  border: 5px solid blue;
  bottom: 5%;
  left: 5%;
  width: 15%;
  height: auto;
`;

function MyVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, []);

  return <Video ref={videoRef} autoPlay></Video>;
}

export default MyVideo;
