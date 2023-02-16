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
      {/* {user.host ? <p>방장</p> : <p></p>} */}
      {user.imgSrc ? <img ref={imgRef} alt="xowns97"></img> : <VideoContainer ref={ref} autoPlay />}
      {/* <UserLabel>{user.nickName}</UserLabel> */}
      {/* {!user.host && user.isReady ? <h2>준비 완료</h2> : <></>} */}
    </Container>
  );
};

export default PeerVideo;
