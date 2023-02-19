import styled from 'styled-components';
import StartButtonImg from '../../assets/images/start-button-activated.png';
import DeStartButtonImg from '../../assets/images/start-button-deactivated.png';
import { useAtomValue } from 'jotai';
import { peerAtom } from '../../app/peer';
import { roomIdAtom } from '../../app/atom';
import { useClientSocket } from '../../module/client-socket';

const Button = styled.button<{ isReady: boolean }>`
  background-color: ${(props) => (props.isReady ? '#652a2a' : 'grey')};
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

function StartButton() {
  const peer = useAtomValue(peerAtom);
  const { socket } = useClientSocket();
  const roomId = useAtomValue(roomIdAtom);

  function onStart() {
    socket.emit('start', roomId);
    console.log('start');
  }

  return (
    <Button onClick={onStart} disabled={!peer.isReady} isReady={peer.isReady}>
      <ButtonImg alt="Start Button" src={peer.isReady ? StartButtonImg : DeStartButtonImg} />
    </Button>
  );
}

export default StartButton;
