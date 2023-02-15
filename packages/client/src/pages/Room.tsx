import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import PeerVideo from '../components/inGame/PeerVideo';
import styled from 'styled-components';
import MyVideo from '../components/inGame/MyVideo';
import { stream } from '../utils/tfjs-movenet';
import PrintScore from '../components/inGame/PrintScore';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import WebRTC from '../components/inGame/WebRTC';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeUser } from '../modules/user';

const UserLabel = styled.h2`
  color: blue;
`;

const VideoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

//todo 스턴 서버 직접 생성 고려(임시)
const pc_config = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
};

// const SOCKET_SERVER_URL = 'http://localhost:8081';
const SOCKET_SERVER_URL = 'http://15.165.237.195:8081';

//todo 주소로 직접 접근 시 홈(로그인)/로비 페이지로 redirect
function Room() {
  const location = useLocation();
  const dispatch = useDispatch();
  const otherUsers = useSelector((state: RootState) => state.users); //! 방장인지도 받을 예정
  const roomId: string = location.state.roomId;
  const nickName: string = location.state.nickName; //check 전역 변수로 관리하도록 수정 고려 필요

  //temp get_room으로 인해 room 정보가 업데이트 될 때마다 소켓이 계속해서 생성된다.
  const socket = io(SOCKET_SERVER_URL);

  useEffect(() => {
    return () => {
      dispatch(initializeUser());
    };
  }, []);

  return (
    <div>
      <VideoWrapper>
        <MyVideo />
        <PrintScore />
      </VideoWrapper>
      <UserLabel>{nickName}</UserLabel>
      <WebRTC socket={socket} nickName={nickName} roomId={roomId} />
      {otherUsers.map((user, index) => (
        <PeerVideo key={index} nickName={user.nickName} stream={user.stream} />
      ))}
    </div>
  );
}

export default Room;
