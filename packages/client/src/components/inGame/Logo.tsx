import type { ReactJSXElement } from '@emotion/react/types/jsx-namespace';
import { useAtom, useAtomValue } from 'jotai';
import styled, { css } from 'styled-components';
import { gameAtom } from '../../app/game';
import { roomInfoAtom } from '../../app/room';
import { useClientSocket } from '../../module/client-socket';
import { GunReload } from '../../utils/sound';
import logoImg from '../../assets/images/logo.png';

const LogoImg = styled.img<{ isClickable: boolean }>`
  position: absolute;
  top: 50%;
  left: 2%;
  transform: translate(0, -50%);
  height: 50%;
  ${(props) =>
    props.isClickable &&
    css`
      cursor: pointer;
    `}
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
      isClickable={!game.isStart && game.peer.isReady}
    />
  ) : (
    <LogoImg
      alt="logo"
      src={logoImg}
      onClick={() => (game.isStart ? null : onReady())}
      isClickable={!game.isStart}
    />
  );

  return logoButton;
}

export default Logo;
