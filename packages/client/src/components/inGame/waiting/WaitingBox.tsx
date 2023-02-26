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
      <Chatting />
    </Container>
  );
}

export default WaitingBox;
