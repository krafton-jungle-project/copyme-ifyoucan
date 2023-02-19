import { useAtomValue } from 'jotai';
import { useState } from 'react';
import styled from 'styled-components';
import { roomIdAtom } from '../../app/atom';
import ReadyButtonImg from '../../assets/images/ready-button-activated.png';
import UnReadyButtonImg from '../../assets/images/ready-button-deactivated.png';
import { useClientSocket } from '../../module/client-socket';

const Button = styled.button<{ isReady: boolean }>`
  background-color: ${(props) => (props.isReady ? 'grey' : '#652a2a')};
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
  const { socket } = useClientSocket();
  const roomId = useAtomValue(roomIdAtom);

  function onReady() {
    if (isReady) {
      socket.emit('unready', roomId);
      console.log('unready!');
    } else {
      socket.emit('ready', roomId);
      console.log('ready!');
    }
    setIsReady(!isReady);
  }

  return (
    <Button onClick={onReady} isReady={isReady}>
      <ButtonImg alt="Ready Button" src={isReady ? UnReadyButtonImg : ReadyButtonImg} />
    </Button>
  );
}

export default ReadyButton;
