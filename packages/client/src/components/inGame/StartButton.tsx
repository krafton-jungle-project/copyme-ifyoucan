import styled from 'styled-components';
import StartButtonImg from '../../assets/images/start-button-activated.png';
import DeStartButtonImg from '../../assets/images/start-button-deactivated.png';
import { useAtomValue } from 'jotai';
import { peerAtom } from '../../app/peer';
import { roomIdAtom } from '../../app/atom';
import { useClientSocket } from '../../module/client-socket';
import { gameAtom, GameStatus } from '../../app/game';
import { useEffect, useState } from 'react';

const Button = styled.button<{ isReady: boolean; isStart: boolean }>`
  background-color: ${(props) => (props.isReady ? '#652a2a' : 'grey')};
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

function StartButton() {
  const peer = useAtomValue(peerAtom);
  const { socket } = useClientSocket();
  const roomId = useAtomValue(roomIdAtom);
  const game = useAtomValue(gameAtom);
  const [isStart, setIsStart] = useState(false);

  useEffect(() => {
    setIsStart(game.status !== GameStatus.WAITING);
  }, [game.status]);

  function onStart() {
    socket.emit('start', roomId);
    console.log('start');
  }

  return (
    <Button onClick={onStart} disabled={!peer.isReady} isReady={peer.isReady} isStart={isStart}>
      <ButtonImg alt="Start Button" src={peer.isReady ? StartButtonImg : DeStartButtonImg} />
    </Button>
  );
}

export default StartButton;
