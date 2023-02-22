import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import InGame from '../components/inGame/InGame';
import { stream, detector } from '../utils/tfjs-movenet';
import { isLoadedAtom } from './Lobby';
import { useAtom, useAtomValue } from 'jotai';
import { peerAtom } from '../app/peer';
import { useResetAtom } from 'jotai/utils';
import ConnectWebRTC from '../components/inGame/ConnectWebRTC';
import GameSocket from '../components/inGame/GameSocket';

import { useClientSocket } from '../module/client-socket';
import { myNickNameAtom, roomIdAtom } from '../app/atom';
import { gameAtom } from '../app/game';
import MotionReady from '../components/inGame/waiting/MotionReady';

//todo 주소로 직접 접근 시 홈(로그인)/로비 페이지로 redirect
//todo stream이나 detector가 없다면 로비로 redirect

function Room() {
  const navigate = useNavigate();

  const [, setIsLoaded] = useAtom(isLoadedAtom);
  const resetPeer = useResetAtom(peerAtom);
  const resetGame = useResetAtom(gameAtom);
  const { socket } = useClientSocket();

  const nickName = useAtomValue(myNickNameAtom);
  const roomId = useAtomValue(roomIdAtom);

  ConnectWebRTC();
  GameSocket();
  MotionReady();

  useEffect(() => {
    if (!nickName || !roomId) {
      console.log('잘못된 접근입니다.');
      navigate('/', { replace: true });
    } else if (!stream || !detector) {
      console.log('비디오 연결이 종료되어 다시 로딩합니다.');
      console.log('error: stream & detector is reloaded.');
      setIsLoaded(false);
      navigate('/', { replace: true });
    }
  }, []);

  useEffect(() => {
    return () => {
      resetPeer();
      resetGame();
      socket.emit('exit_room');
      window.location.reload();
    };
  }, [resetPeer, resetGame, socket]);

  return <InGame />;
}

export default Room;
