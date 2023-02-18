import { useLocation, useNavigate } from 'react-router-dom';
import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import InGame from '../components/inGame/InGame';
import { stream, detector } from '../utils/tfjs-movenet';
import { isLoadedAtom } from './Lobby';
import { useAtom, useSetAtom } from 'jotai';
import { nickNameAtom, roomIdAtom } from '../app/atom';
import { peerAtom } from '../app/peer';
import { useResetAtom } from 'jotai/utils';

// const SOCKET_SERVER_URL = 'http://localhost:8081';
const SOCKET_SERVER_URL = 'http://15.165.237.195:8081';

//todo 주소로 직접 접근 시 홈(로그인)/로비 페이지로 redirect
//todo stream이나 detector가 없다면 로비로 redirect

function Room() {
  const navigate = useNavigate();
  const [, setIsLoaded] = useAtom(isLoadedAtom);
  const setNickName = useSetAtom(nickNameAtom);
  const setRoomId = useSetAtom(roomIdAtom);
  const resetPeer = useResetAtom(peerAtom);

  useEffect(() => {
    if (!stream || !detector) {
      alert('비디오 연결이 종료되어 다시 로딩합니다.');
      console.log('error: stream & detector is reloaded.');
      setIsLoaded(false);
      navigate('/', { replace: true });
    }
  }, []);

  const location = useLocation();
  setRoomId(location.state.roomId);
  setNickName(location.state.nickName);

  const socket: Socket = io(SOCKET_SERVER_URL);
  console.log('room socket connection complete.');

  useEffect(() => {
    return () => {
      resetPeer();
      socket.disconnect();
      console.log('room socket disconnected.');
    };
  }, []);

  return (
    <>
      <InGame socket={socket} />
    </>
  );
}

export default Room;
