import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import InGame from '../components/inGame/InGame';
import { stream, detector } from '../utils/tfjs-movenet';
import { isLoadedAtom } from './Lobby';
import { useAtom, useSetAtom } from 'jotai';
import { nickNameAtom, roomIdAtom } from '../app/atom';
import { peerAtom } from '../app/peer';
import { useResetAtom } from 'jotai/utils';

//todo 주소로 직접 접근 시 홈(로그인)/로비 페이지로 redirect
//todo stream이나 detector가 없다면 로비로 redirect

function Room() {
  const navigate = useNavigate();
  const location = useLocation();

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
    return () => {
      resetPeer();
    };
  }, []);

  useEffect(() => {
    setNickName(location.state.nickName);
  }, [location.state.nickName, setNickName]);

  useEffect(() => {
    setRoomId(location.state.roomId);
  }, [location.state.roomId, setRoomId]);

  return <InGame />;
}

export default Room;
