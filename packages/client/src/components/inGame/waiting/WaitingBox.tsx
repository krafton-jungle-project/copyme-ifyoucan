import styled from 'styled-components';
import { useAtomValue } from 'jotai';
import { gameAtom } from '../../../app/game';
import { peerInfoAtom } from '../../../app/peer';
import MyVideo from './MyVideo';
import PeerVideo from './PeerVideo';
import Chatting from './Chatting';
import { roomInfoAtom } from '../../../app/room';
import { myNickName } from '../../../pages/Lobby';

const Container = styled.div<{ isStart: boolean }>`
  position: absolute;
  bottom: 0%;
  width: 100%;
  height: 80%;
  visibility: ${(props) => (props.isStart ? 'hidden' : 'visible')};
  transition-property: visibility;
  transition-delay: 0.5s;
`;

const Wrapper = styled.div<{ isMe: boolean; isStart: boolean }>`
  position: absolute;
  top: 50%;
  transform: translate(0, -50%); /* 세로 가운데 정렬(top: 50%와 같이 사용) */
  left: ${(props) => (props.isMe ? (props.isStart ? '-35%' : '0%') : 'none')};
  right: ${(props) => (props.isMe ? 'none' : props.isStart ? '-35%' : '0%')};
  width: 27.5%;
  aspect-ratio: 4/5;
  transition-property: left, right;
  transition-duration: 0.5s, 0.5s;
`;

const NickNameBox = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0%;
  width: 100%;
  height: 10%;
  font-size: 30px;
  font-weight: bold;
`;

const ReadyState = styled.div<{ isHost: boolean; isReady: boolean }>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0%;
  width: 100%;
  height: 10%;
  font-size: 30px;
  font-weight: bold;
  color: ${(props) => (props.isHost ? 'yellow' : props.isReady ? 'red' : 'grey')};
`;

//temp
const TempChattingBox = styled.div<{ isStart: boolean }>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: ${(props) => (props.isStart ? '150%' : '50%')};
  left: 50%;
  transform: translate(-50%, -50%);
  width: 38%;
  height: 100%;

  font-size: 5vw;
  font-weight: 400;

  border: 0.2rem solid #fff;
  border-radius: 2rem;
  padding: 0.4em;
  box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #ff1178, 0 0 0.8rem #ff1178,
    0 0 2.8rem #ff1178, inset 0 0 1.3rem #ff1178;

  color: #fff;
  text-shadow: /* White glow */ 0 0 5px #fff, 0 0 20px #fff, 0 0 50px #fff,
    /* Green glow */ 0 0 42px #ff1178, 0 0 120px #ff1178, 0 0 92px #ff1178, 0 0 102px #ff1178,
    0 0 151px #ff1178;

  transition-property: top;
  transition-duration: 0.5s;
`;

function WaitingBox() {
  const game = useAtomValue(gameAtom);
  const roomInfo = useAtomValue(roomInfoAtom);
  const peerInfo = useAtomValue(peerInfoAtom);

  return (
    <Container isStart={game.isStart}>
      <Wrapper isMe={true} isStart={game.isStart}>
        <NickNameBox>{myNickName}</NickNameBox>
        <MyVideo />
        <ReadyState isHost={roomInfo.host} isReady={game.user.isReady}>
          {roomInfo.host ? '👑 HOST' : game.user.isReady ? 'READY' : 'NOT READY'}
        </ReadyState>
      </Wrapper>
      <Wrapper isMe={false} isStart={game.isStart}>
        <NickNameBox>{peerInfo.nickName}</NickNameBox>
        <PeerVideo />
        <ReadyState isHost={!roomInfo.host} isReady={game.peer.isReady}>
          {roomInfo.host
            ? peerInfo.nickName
              ? game.peer.isReady
                ? 'READY'
                : 'NOT READY'
              : 'WAITING'
            : '👑 HOST'}
        </ReadyState>
      </Wrapper>
      <TempChattingBox isStart={game.isStart}>Chat Box</TempChattingBox>
      {/* <Chatting />/ */}
    </Container>
  );
}

export default WaitingBox;
