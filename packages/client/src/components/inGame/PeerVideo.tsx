import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import type { RootState } from '../../app/store';

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
      {user.host ? <p>방장</p> : <p></p>}
      {user.imgSrc ? <img ref={imgRef}></img> : <VideoContainer ref={ref} autoPlay />}
      <UserLabel>{user.nickName}</UserLabel>
      {!user.host && user.isReady ? <h2>준비 완료</h2> : <></>}
    </Container>
  );
};

export default PeerVideo;
