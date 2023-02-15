import { useNavigate } from 'react-router-dom';
import { useState, useRef } from 'react';
import type { Socket } from 'socket.io-client';
import type { RootState } from '../../../app/store';
import { useSelector } from 'react-redux';

interface Props {
  socket: Socket;
  roomId: string;
}

function ReadyButton({ socket, roomId }: Props) {
  const [isReady, setIsReady] = useState<boolean>(false);
  const host = useSelector((state: RootState) => state.host);
  const otherUsers = useSelector((state: RootState) => state.users);

  //TODO: 클릭 할 때 마다 서버에서 모두 준비했는지는 안좋아 보임

  // 준비 or 게임 시작
  const ready = () => {
    if (host) {
      socket.emit('game_start', roomId);
    } else {
      setIsReady(true);
      socket.emit('ready', roomId);
    }
  };

  // 준비 취소
  const cancleReady = () => {
    setIsReady(false);
    socket.emit('unready', roomId);
  };

  return (
    <>
      {host ? (
        <button
          // 모두 레디 안되어 있으면 게임 시작 버튼 비활성화
          disabled={otherUsers.filter((user) => user.isReady === true).length !== otherUsers.length}
          onClick={ready}
        >
          게임 시작
        </button>
      ) : !isReady ? (
        <button disabled={isReady} onClick={ready}>
          준비
        </button>
      ) : (
        <button disabled={!isReady} onClick={cancleReady}>
          취소
        </button>
      )}
    </>
  );
}
export default ReadyButton;
