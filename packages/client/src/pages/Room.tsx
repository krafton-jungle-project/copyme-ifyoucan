import { useLocation } from 'react-router-dom';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { initializeUser } from '../modules/user';
import InGame from '../components/inGame/InGame';

// const SOCKET_SERVER_URL = 'http://localhost:8081';
const SOCKET_SERVER_URL = 'http://15.165.237.195:8081';

//todo 주소로 직접 접근 시 홈(로그인)/로비 페이지로 redirect
function Room() {
  const location = useLocation();
  const dispatch = useDispatch();
  const roomId: string = location.state.roomId;
  const nickName: string = location.state.nickName; //check 전역 변수로 관리하도록 수정 고려 필요

  //temp get_room으로 인해 room 정보가 업데이트 될 때마다 소켓이 계속해서 생성된다.
  const socket: Socket = io(SOCKET_SERVER_URL);
  console.log('room, 소켓연결');

  useEffect(() => {
    return () => {
      dispatch(initializeUser());
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <InGame socket={socket} roomId={roomId} nickName={nickName} />
    </>
  );
}

export default Room;
