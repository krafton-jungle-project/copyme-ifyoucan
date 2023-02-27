import type { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { useAtom, useAtomValue } from 'jotai';
import styled from 'styled-components';
import { gameAtom } from '../../app/game';
import { roomInfoAtom } from '../../app/room';
import { useClientSocket } from '../../module/client-socket';
import { GunReload } from '../../utils/sound';
import logoImg from '../../assets/images/logo.png';

const Container = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  left: 0%;
  width: 10%;
  height: 100%;
`;

const LogoImg = styled.img`
  position: absolute;
  width: 100%;
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

  let logoButton: ReactJSXElement = roomInfo.host ? (
    <LogoImg
      alt="logo"
      src={logoImg}
      onClick={() => (game.isStart ? null : game.peer.isReady ? onStart() : null)}
    />
  ) : (
    <LogoImg alt="logo" src={logoImg} onClick={() => (game.isStart ? null : onReady())} />
  );

  return <Container>{logoButton}</Container>;
}

export default Logo;
