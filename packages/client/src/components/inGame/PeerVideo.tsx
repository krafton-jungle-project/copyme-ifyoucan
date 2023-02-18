import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import type { PeerState } from '../../app/peer';

const Container = styled.div`
  position: relative;
  width: 400;
  height: 300;
`;

const VideoContainer = styled.video`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  width: 400;
  height: 300;
`;

const OffendImg = styled.img`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
`;

export interface IProps {
  socketId: string;
  nickName: string;
  host: boolean;
  stream: MediaStream;
  isReady: boolean;
  imgSrc?: null | string;
}

const PeerVideo = ({ peer }: { peer: PeerState }) => {
  // const PeerVideo = ({ stream, nickName }: Props) => {
  const ref = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.srcObject = peer.stream;
    if (imgRef.current && peer.imgSrc) imgRef.current.src = peer.imgSrc;
  }, [peer.stream, peer.imgSrc]);

  return (
    <Container>
      {peer.imgSrc ? (
        <OffendImg ref={imgRef} alt="xowns97" width="400" height="300"></OffendImg>
      ) : (
        <VideoContainer ref={ref} autoPlay />
      )}
    </Container>
  );
};

export default PeerVideo;
