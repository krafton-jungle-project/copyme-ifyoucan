import { useAtomValue } from 'jotai';
import { useState } from 'react';
import styled from 'styled-components';
import { hostAtom, roomIdAtom } from '../../app/atom';
import { peerAtom } from '../../app/peer';
import { useClientSocket } from '../../module/client-socket';

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

function ReadyBtn() {
  const { socket } = useClientSocket();
  const [ready, setReady] = useState(false);
  const host = useAtomValue(hostAtom);
  const roomId = useAtomValue(roomIdAtom);
  const peer = useAtomValue(peerAtom);

  function onReady() {
    if (ready) {
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
    socket.emit('start', roomId); //! 서버 쪽 코드 변경 있음
    console.log('start');
  }

  return host ? (
    <Btn // 모두 레디 안되어 있으면 게임 시작 버튼 비활성화
      disabled={!peer.isReady}
      onClick={start}
    >
      START
    </Btn>
  ) : (
    <Btn onClick={() => onReady()}>{ready ? 'UNREADY' : 'READY'}</Btn>
  );
}

export default ReadyBtn;
