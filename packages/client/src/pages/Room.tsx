import { useLocation, useNavigate } from 'react-router-dom';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeUser } from '../modules/user';
import InGame from '../components/inGame/InGame';
import { stream, detector } from '../utils/tfjs-movenet';
import { isLoadedAtom } from './Lobby';
import { useAtom } from 'jotai';

// const SOCKET_SERVER_URL = 'http://localhost:8081';
const SOCKET_SERVER_URL = 'http://15.165.237.195:8081';

//todo 주소로 직접 접근 시 홈(로그인)/로비 페이지로 redirect
//todo stream이나 detector가 없다면 로비로 redirect
function Room() {
  const navigate = useNavigate();
  const [, setIsLoaded] = useAtom(isLoadedAtom);

  useEffect(() => {
    if (!stream || !detector) {
      alert('비디오 연결이 종료되어 다시 로딩합니다.');
      console.log('error: stream & detector is reloaded.');
      setIsLoaded(false);
      navigate('/', { replace: true });
    }
  }, []);

  const location = useLocation();
  const roomId: string = location.state.roomId;
  const nickName: string = location.state.nickName; //check 전역 변수로 관리하도록 수정 고려 필요
  const dispatch = useDispatch();

  //temp get_room으로 인해 room 정보가 업데이트 될 때마다 소켓이 계속해서 생성된다.
  const socket: Socket = io(SOCKET_SERVER_URL);
  console.log('room socket connection complete.');

  useEffect(() => {
    return () => {
      dispatch(initializeUser());
      socket.disconnect();
      console.log('room socket disconnected.');
    };
  }, []);

  return (
    <>
      <InGame socket={socket} roomId={roomId} nickName={nickName} />
    </>
  );
}

export default Room;
