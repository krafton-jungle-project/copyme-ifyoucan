import { useAtomValue } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { gameAtom } from '../app/game';
import { peerInfoAtom } from '../app/peer';
import { roomInfoAtom } from '../app/room';
import GameEventHandler from '../components/inGame/GameEventHandler';
import useConnectWebRTC from '../components/inGame/hooks/useConnectWebRTC';
import { usePreventExit } from '../components/inGame/hooks/usePreventExit';
import InGame from '../components/inGame/InGame';
import MotionReady from '../components/inGame/waiting/MotionReady';
import { useClientSocket } from '../module/client-socket';
import { useMovenetStream } from '../module/movenet-stream';
import { getUser } from '../utils/local-storage';
import { GameMusic, RoomEnter, RoomExit } from '../utils/sound';

const Container = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

function Room() {
  const myNickName = getUser().nickName;
  const navigate = useNavigate();
  const { socket } = useClientSocket();
  const resetGame = useResetAtom(gameAtom);
  const resetPeerInfo = useResetAtom(peerInfoAtom);
  const roomInfo = useAtomValue(roomInfoAtom);
  const resetRoomInfo = useResetAtom(roomInfoAtom);
  const { isStreamReady, initialize } = useMovenetStream();

  usePreventExit();
  useConnectWebRTC();
  GameEventHandler();
  MotionReady();

  useEffect(() => {
    if (!myNickName || !roomInfo.roomId) {
      alert('잘못된 접근입니다.');
      navigate('/', { replace: true });
      window.location.reload();
    } else if (!isStreamReady) {
      alert('비디오 연결이 종료되어 다시 로딩합니다.');
      initialize();
      navigate('/', { replace: true });
      window.location.reload();
    }

    RoomEnter.play(); // 자신 입장음

    // 방을 나갈 때
    return () => {
      resetRoomInfo();
      resetPeerInfo();
      resetGame();
      GameMusic.currentTime = 0;
      GameMusic.pause();
      socket.emit('exit_room', myNickName);
      RoomExit.play(); // 자신 퇴장음
    };
  }, []);

  return (
    <Container>
      <InGame />
    </Container>
  );
}

export default Room;
