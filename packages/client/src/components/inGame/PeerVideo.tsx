import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import type { RootState } from '../../app/store';

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

const PeerVideo = ({ user }: { user: IProps }) => {
  // const PeerVideo = ({ stream, nickName }: Props) => {
  const ref = useRef<HTMLVideoElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => {
    if (ref.current) ref.current.srcObject = user.stream;
    if (imgRef.current && user.imgSrc) imgRef.current.src = user.imgSrc;
  }, [user.stream, user.imgSrc]);

  return (
    <Container>
      {user.imgSrc ? (
        <OffendImg ref={imgRef} alt="xowns97" width="400" height="300"></OffendImg>
      ) : (
        <VideoContainer ref={ref} autoPlay />
      )}
    </Container>
  );
};

export default PeerVideo;
