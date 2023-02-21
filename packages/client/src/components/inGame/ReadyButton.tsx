import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { roomIdAtom } from '../../app/atom';
import { gameAtom, GameStatus } from '../../app/game';
import ReadyButtonImg from '../../assets/images/ready-button-activated.png';
import UnReadyButtonImg from '../../assets/images/ready-button-deactivated.png';
import { useClientSocket } from '../../module/client-socket';
import SetReadyState from './SetReadyState';
import { gunReload } from '../../utils/sound';

const Button = styled.button<{ isReady: boolean; isStart: boolean }>`
  background-color: ${(props) => (props.isReady ? 'grey' : '#652a2a')};
  background-position: 0px 0px;
  position: absolute;
  border-radius: 10px;
  bottom: ${(props) => (props.isStart ? '-10%' : '10%')};
  left: 40%;
  width: 20%;
  height: 10%;
  transition-property: bottom;
  transition-duration: 0.5s;
`;

const ButtonImg = styled.img`
  width: 100%;
  height: 100%;
`;

function ReadyButton() {
  const [isReady, setIsReady] = useState(false);
  const { socket } = useClientSocket();
  const roomId = useAtomValue(roomIdAtom);
  const game = useAtomValue(gameAtom);
  const [isStart, setIsStart] = useState(false);

  useEffect(() => {
    setIsStart(game.status !== GameStatus.WAITING);
  }, [game.status]);

  function onReady() {
    if (isReady) {
      gunReload.play();
      socket.emit('unready', roomId);
      console.log('unready!');
    } else {
      gunReload.play();
      socket.emit('ready', roomId);
      console.log('ready!');
    }
    setIsReady(!isReady);
  }

  // SetReadyState(isReady, setIsReady);

  return (
    <Button onClick={onReady} isReady={isReady} isStart={isStart}>
      <ButtonImg alt="Ready Button" src={isReady ? UnReadyButtonImg : ReadyButtonImg} />
    </Button>
  );
}

export default ReadyButton;
