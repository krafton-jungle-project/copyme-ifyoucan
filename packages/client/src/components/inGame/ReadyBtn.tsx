import { ready } from '@tensorflow/tfjs-core';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';
import styled from 'styled-components';
import { RootState } from '../../app/store';
import host from '../../modules/host';

const Btn = styled.button`
  font-size: 20px;
  font-weight: 800;
  background-color: #d5e6f4;
  border-radius: 20px;
  position: absolute;
  bottom: 40px;
  left: 600px;
  width: 170px;
  height: 50px;
  border-style: none;
  box-shadow: 2.5px 2.5px 2.5px rgba(0, 0, 0, 0.3);
`;

function ReadyBtn({ socket, roomId }: { socket: Socket; roomId: string }) {
  //TODO: 클릭 할 때 마다 서버에서 모두 준비했는지는 안좋아 보임
  const [ready, setReady] = useState(false);
  const host = useSelector((state: RootState) => state.host);
  const otherUsers = useSelector((state: RootState) => state.users);

  function onReady() {
    if (ready) {
      //todo ready state에 따라 상태 보여줘야함
      setReady(!ready);
      socket.emit('unready', roomId);
      console.log('unready!');
    } else {
      setReady(!ready);
      socket.emit('ready', roomId);
      console.log('ready!');
    }
  }

  function start() {
    socket.emit('game_start', roomId); //! 서버 쪽 코드 변경 있음
    console.log('start');
  }

  return host ? (
    <Btn // 모두 레디 안되어 있으면 게임 시작 버튼 비활성화
      disabled={otherUsers.filter((user) => user.isReady === true).length !== otherUsers.length}
      onClick={start}
    >
      START
    </Btn>
  ) : (
    <Btn onClick={() => onReady()}>{ready ? 'UNREADY' : 'READY'}</Btn>
  );
}

export default ReadyBtn;
