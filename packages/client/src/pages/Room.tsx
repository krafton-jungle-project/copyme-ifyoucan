import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import InGame from '../components/inGame/InGame';
import { stream, detector } from '../utils/tfjs-movenet';
import { isLoadedAtom, myNickName } from './Lobby';
import { useAtomValue, useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import useConnectWebRTC from '../components/inGame/hooks/useConnectWebRTC';
import GameEventHandler from '../components/inGame/GameEventHandler';
import { useClientSocket } from '../module/client-socket';
import { gameAtom } from '../app/game';
import MotionReady from '../components/inGame/waiting/MotionReady';
import { peerInfoAtom } from '../app/peer';
import { roomInfoAtom } from '../app/room';
import { usePreventExit } from '../components/inGame/hooks/usePreventExit';

function Room() {
  const navigate = useNavigate();
  const { socket } = useClientSocket();
  const setIsLoaded = useSetAtom(isLoadedAtom);
  const resetGame = useResetAtom(gameAtom);
  const resetPeerInfo = useResetAtom(peerInfoAtom);
  const roomInfo = useAtomValue(roomInfoAtom);
  const resetRoomInfo = useResetAtom(roomInfoAtom);

  usePreventExit(); //temp
  useConnectWebRTC();
  GameEventHandler();
  MotionReady();

  useEffect(() => {
    if (!myNickName || !roomInfo.roomId) {
      alert('잘못된 접근입니다.');
      navigate('/', { replace: true });
      window.location.reload(); //check
    } else if (!stream || !detector) {
      alert('비디오 연결이 종료되어 다시 로딩합니다.');
      setIsLoaded(false);
      navigate('/', { replace: true });
      window.location.reload(); //check
    }

    // 방을 나갈 때
    return () => {
      resetRoomInfo();
      resetPeerInfo();
      resetGame();
      socket.emit('exit_room', myNickName);
    };
  }, []);

  return <InGame />;
}

export default Room;
