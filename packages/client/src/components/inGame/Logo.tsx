import type { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { useAtom, useAtomValue } from 'jotai';
import styled from 'styled-components';
import { gameAtom } from '../../app/game';
import { roomInfoAtom } from '../../app/room';
import { useClientSocket } from '../../module/client-socket';
import { GunReload } from '../../utils/sound';

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

// hidden start/ready Button
function Logo() {
  const { socket } = useClientSocket();
  const roomInfo = useAtomValue(roomInfoAtom);
  const [game, setGame] = useAtom(gameAtom);

  function onStart() {
    socket.emit('start', roomInfo.roomId);
  }

  function onReady() {
    if (game.user.isReady) {
      GunReload.play();
      socket.emit('unready', roomInfo.roomId);
    } else {
      GunReload.play();
      socket.emit('ready', roomInfo.roomId);
    }

    setGame((prev) => ({
      ...prev,
      user: { ...prev.user, isReady: !prev.user.isReady },
    }));
  }

  let hiddenButton: ReactJSXElement | null = game.isStart ? null : roomInfo.host ? (
    <Button onClick={onStart} style={{ visibility: game.peer.isReady ? 'visible' : 'hidden' }} />
  ) : (
    <Button onClick={onReady} />
  );

  return <Container>{hiddenButton}</Container>;
}

export default Logo;
