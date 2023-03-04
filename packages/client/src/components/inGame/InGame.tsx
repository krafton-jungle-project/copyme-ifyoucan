import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { gameAtom } from '../../app/game';
import { roomInfoAtom } from '../../app/room';
import exitImg from '../../assets/images/in-game/exit.png';
import logoImg from '../../assets/images/logo.png';
import { useClientSocket } from '../../module/client-socket';
import { BackgroundMusic, GunReload } from '../../utils/sound';
import Announcer from './Announcer';
import GameBox from './game/GameBox';
import RoundBox from './game/RoundBox';
import WaitingBox from './waiting/WaitingBox';

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  aspect-ratio: 16 / 9;
  min-width: 900px;
  min-height: 500px;
  max-height: 90%;
`;

const FadeBackGround = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 120%;
  height: 120%;
  background-color: rgba(0, 0, 0, 0.5);
`;

const Header = styled.div`
  position: absolute;
  top: 2%;
  width: 100%;
  height: 15%;
`;

const LogoWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 2%;
  transform: translate(0, -50%);
  width: 10%;
  height: 50%;
`;

const Logo = styled.img<{ isClickable: boolean; isStart: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  visibility: ${(props) => (props.isStart ? 'hidden' : 'visible')};
  ${(props) =>
    props.isClickable &&
    css`
      cursor: pointer;
    `}
`;

const ExitWrapper = styled.div`
  position: absolute;
  top: 50%;
  right: 2%;
  transform: translate(0, -50%);
  width: 5%;
  height: 50%;
  cursor: pointer;
`;

const ExitImg = styled.img`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%);
  height: 70%;
`;

const ExitTxt = styled.p`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  font-size: 12px;
  color: #baffba;
  text-shadow: 0 0 5px #15ff00;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

function InGame() {
  const { socket } = useClientSocket();
  const roomInfo = useAtomValue(roomInfoAtom);
  const game = useAtomValue(gameAtom);
  const navigate = useNavigate();

  function onStart() {
    if (game.isStart || !game.peer.isReady) return;

    socket.emit('start', roomInfo.roomId);
  }

  function onReady() {
    if (game.isStart) return;

    if (game.user.isReady) {
      GunReload.play();
      socket.emit('unready', roomInfo.roomId);
    } else {
      GunReload.play();
      socket.emit('ready', roomInfo.roomId);
    }
  }

  const exitRoom = () => {
    if (game.isStart) {
      BackgroundMusic.currentTime = 0;
    }
    navigate('/', { replace: true });
  };

  return (
    <>
      <FadeBackGround />
      <Container>
        <Header>
          <LogoWrapper>
            <Logo // hidden ready or start button
              alt="logo"
              src={logoImg}
              onClick={() => {
                roomInfo.host ? onStart() : onReady();
              }}
              isClickable={roomInfo.host ? game.peer.isReady : true}
              isStart={game.isStart}
            />
          </LogoWrapper>
          <RoundBox />
          <Announcer />
          <ExitWrapper onClick={exitRoom}>
            <ExitImg alt="exit" src={exitImg} />
            <ExitTxt>EXIT</ExitTxt>
          </ExitWrapper>
        </Header>
        <WaitingBox />
        <GameBox />
      </Container>
    </>
  );
}

export default InGame;
