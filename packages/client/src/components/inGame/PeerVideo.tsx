import { useEffect, useRef } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  position: relative;
  display: inline-block;
  width: 240px;
  height: 270px;
  margin: 5px;
`;

const VideoContainer = styled.video`
  width: 240px;
  height: 240px;
  background-color: black;
`;

const UserLabel = styled.p`
  display: inline-block;
  position: absolute;
  top: 230px;
  left: 0px;
`;

interface Props {
  stream: MediaStream;
  nickName: string;
  host: boolean;
  isReady: boolean;
}

const PeerVideo = ({ stream, nickName, host, isReady }: Props) => {
  // const PeerVideo = ({ stream, nickName }: Props) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.srcObject = stream;
  }, [stream]);

  return (
    <Container>
      {host ? <p>방장</p> : <p></p>}
      <VideoContainer ref={ref} autoPlay />
      <UserLabel>{nickName}</UserLabel>
      {!host && isReady ? <h2>준비 완료</h2> : <></>}
    </Container>
  );
};

export default PeerVideo;
