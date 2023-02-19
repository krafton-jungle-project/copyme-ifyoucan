import { useAtomValue } from 'jotai';
import { useState } from 'react';
import type { Socket } from 'socket.io-client';
import styled from 'styled-components';
import { hostAtom, roomIdAtom } from '../../app/atom';
import { peerAtom } from '../../app/peer';
import RSimg from '../../assets/images/ready-button.png';

const Button = styled.button`
  background-color: #652a2a;
  background-position: 0px 0px;
  position: absolute;
  border-radius: 10px;
  bottom: 10%;
  left: 40%;
  width: 20%;
  height: 10%;
`;

const ButtonImg = styled.img`
  width: 100%;
  height: 100%;
`;

function ReadyButton() {
  const [isReady, setIsReady] = useState(false);
  // const roomId = useAtomValue(roomIdAtom);

  function onReady() {
    if (isReady) {
      // socket.emit('unready', roomId);
      console.log('unready!');
    } else {
      // socket.emit('ready', roomId);
      console.log('ready!');
    }
    setIsReady(!isReady);
  }

  return (
    <Button onClick={onReady}>
      <ButtonImg alt="Ready Button" src={RSimg} />
    </Button>
  );
}

export default ReadyButton;
