import { atom, useAtom, useAtomValue } from 'jotai';
import styled from 'styled-components';
import { roomIdAtom } from '../../../app/atom';
import ReadyButtonImg from '../../../assets/images/ready-button-activated.png';
import UnReadyButtonImg from '../../../assets/images/ready-button-deactivated.png';
import { useClientSocket } from '../../../module/client-socket';
import { gunReload } from '../../../utils/sound';
import { isStartAtom } from '../InGame';

const Button = styled.button<{ imReady: boolean; isStart: boolean }>`
  position: fixed;
  top: 0%;
  right: 0%;
  width: 5%;
  height: 5%;
  background-color: ${(props) => (props.imReady ? 'grey' : '#652a2a')};
  background-position: 0px 0px;
  border-radius: 10px;
`;

const ButtonImg = styled.img`
  width: 100%;
  height: 100%;
`;

export const imReadyAtom = atom(false);
imReadyAtom.onMount = (setAtom) => {
  setAtom(false);
  return () => {
    setAtom(false);
  };
};

function ReadyButton() {
  const [imReady, setImReady] = useAtom(imReadyAtom);
  const { socket } = useClientSocket();
  const roomId = useAtomValue(roomIdAtom);
  const isStart = useAtomValue(isStartAtom);

  function onReady() {
    if (imReady) {
      gunReload.play();
      socket.emit('unready', roomId);
      console.log('unready!');
    } else {
      gunReload.play();
      socket.emit('ready', roomId);
      console.log('ready!');
    }
    setImReady(!imReady);
  }

  return (
    <Button onClick={onReady} imReady={imReady} isStart={isStart}>
      <ButtonImg alt="Ready Button" src={imReady ? UnReadyButtonImg : ReadyButtonImg} />
    </Button>
  );
}

export default ReadyButton;
