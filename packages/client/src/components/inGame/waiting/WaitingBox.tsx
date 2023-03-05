import { useAtomValue } from 'jotai';
import styled from 'styled-components';
import { gameAtom } from '../../../app/game';
import { peerInfoAtom } from '../../../app/peer';
import { roomInfoAtom } from '../../../app/room';
import { myNickName } from '../../../pages/Lobby';
import Chatting from './Chatting';
import MyVideo from './MyVideo';
import PeerVideo from './PeerVideo';

const Container = styled.div<{ isStart: boolean }>`
  position: absolute;
  bottom: 0;
  width: 100%;
  height: 80%;
  visibility: ${(props) => (props.isStart ? 'hidden' : 'visible')};
`;

const Wrapper = styled.div<{ isMe: boolean; isStart: boolean }>`
  position: absolute;
  top: 50%;
  transform: translate(0, -50%);
  left: ${(props) => (props.isMe ? (props.isStart ? '-35%' : '0%') : 'none')};
  right: ${(props) => (props.isMe ? 'none' : props.isStart ? '-35%' : '0%')};
  width: 27.5%;
  aspect-ratio: 7/10;
  transition: 0.5s;
  transition-delay: ${(props) => (props.isStart ? 'none' : '0.5s')};
`;

const ReadyState = styled.div<{ isHost: boolean; isReady: boolean }>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0;
  width: 100%;
  height: 15%;
  font-size: 30px;
  font-weight: bold;
  color: ${(props) => (props.isHost ? 'yellow' : props.isReady ? 'red' : 'grey')};
`;

const NickNameBox = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  width: 100%;
  height: 15%;
  font-size: 30px;
  font-weight: bold;
`;

function WaitingBox() {
  const game = useAtomValue(gameAtom);
  const roomInfo = useAtomValue(roomInfoAtom);
  const peerInfo = useAtomValue(peerInfoAtom);

  return (
    <Container isStart={game.isStart}>
      <Wrapper isMe={true} isStart={game.isStart}>
        <ReadyState isHost={roomInfo.host} isReady={game.user.isReady}>
          {roomInfo.host ? '👑 HOST' : game.user.isReady ? 'READY' : 'NOT READY'}
        </ReadyState>
        <MyVideo />
        <NickNameBox>{myNickName}</NickNameBox>
      </Wrapper>
      <Wrapper isMe={false} isStart={game.isStart}>
        <ReadyState isHost={!roomInfo.host} isReady={game.peer.isReady}>
          {roomInfo.host
            ? peerInfo.nickName
              ? game.peer.isReady
                ? 'READY'
                : 'NOT READY'
              : 'WAITING'
            : '👑 HOST'}
        </ReadyState>
        <PeerVideo />
        <NickNameBox>{peerInfo.nickName}</NickNameBox>
      </Wrapper>
      <Chatting />
    </Container>
  );
}

export default WaitingBox;
