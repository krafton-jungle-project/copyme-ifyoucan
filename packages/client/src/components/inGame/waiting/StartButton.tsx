import styled from 'styled-components';
import StartButtonImg from '../../../assets/images/start-button-activated.png';
import DeStartButtonImg from '../../../assets/images/start-button-deactivated.png';
import { useAtomValue } from 'jotai';
import { peerAtom } from '../../../app/peer';
import { roomIdAtom } from '../../../app/atom';
import { useClientSocket } from '../../../module/client-socket';
import { isStartAtom } from '../InGame';

const Button = styled.button<{ isReady: boolean; isStart: boolean }>`
  position: fixed;
  top: 0%;
  right: 0%;
  width: 5%;
  height: 5%;
  background-color: ${(props) => (props.isReady ? '#652a2a' : 'grey')};
  background-position: 0px 0px;
  border-radius: 10px;
`;

const ButtonImg = styled.img`
  width: 100%;
  height: 100%;
`;

function StartButton() {
  const peer = useAtomValue(peerAtom);
  const { socket } = useClientSocket();
  const roomId = useAtomValue(roomIdAtom);
  const isStart = useAtomValue(isStartAtom);

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
