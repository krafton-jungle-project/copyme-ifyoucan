import type { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { atom, useAtom, useAtomValue } from 'jotai';
import styled from 'styled-components';
import { imHostAtom, roomIdAtom } from '../../app/atom';
import { peerAtom } from '../../app/peer';
import { useClientSocket } from '../../module/client-socket';
import { gunReload } from '../../utils/sound';
import { isStartAtom } from './InGame';

const Container = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0%;
  width: 15%;
  height: 100%;
`;

const Button = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer; /* 마우스 올리면 손모양 커서 */
`;

//todo: 한 곳에 모아야 한다
export const imReadyAtom = atom(false);
imReadyAtom.onMount = (setAtom) => {
  setAtom(false);
  return () => {
    setAtom(false);
  };
};

// hidden start/ready Button
function Logo() {
  const peer = useAtomValue(peerAtom);
  const { socket } = useClientSocket();
  const roomId = useAtomValue(roomIdAtom);
  const imHost = useAtomValue(imHostAtom);
  const [imReady, setImReady] = useAtom(imReadyAtom);
  const isStart = useAtomValue(isStartAtom);

  function onStart() {
    socket.emit('start', roomId);
    console.log('start');
  }

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

  let hiddenButton: ReactJSXElement | null = isStart ? null : imHost ? (
    <Button onClick={onStart} style={{ visibility: peer.isReady ? 'visible' : 'hidden' }} />
  ) : (
    <Button onClick={onReady} />
  );

  return <Container>{hiddenButton}</Container>;
}

export default Logo;
