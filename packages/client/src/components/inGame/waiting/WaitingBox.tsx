import styled from 'styled-components';
import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { gameAtom } from '../../../app/game';
import { imHostAtom, myNickNameAtom } from '../../../app/atom';
import { isStartAtom } from '../InGame';
import { peerAtom } from '../../../app/peer';
import MyVideo from './MyVideo';
import PeerVideo from './PeerVideo';
import Chatting from './Chatting';
import { imReadyAtom } from '../Logo';

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
  const setGame = useSetAtom(gameAtom);
  const myNickName = useAtomValue(myNickNameAtom);
  const peer = useAtomValue(peerAtom);
  const peerNickName = peer.nickName;
  const imHost = useAtomValue(imHostAtom);
  const imReady = useAtomValue(imReadyAtom);
  const isStart = useAtomValue(isStartAtom);

  useEffect(() => {
    if (imHost) {
      setGame((prev) => ({ ...prev, isOffender: true }));
    }
  }, [imHost]);

  return (
    <Container isStart={isStart}>
      <Wrapper isMe={true} isStart={isStart}>
        <NickNameBox>{myNickName}</NickNameBox>
        <MyVideo />
        <ReadyState isHost={imHost} isReady={imReady}>
          {imHost ? '👑 HOST' : imReady ? 'READY' : 'NOT READY'}
        </ReadyState>
      </Wrapper>
      <Wrapper isMe={false} isStart={isStart}>
        <NickNameBox>{peerNickName}</NickNameBox>
        <PeerVideo />
        <ReadyState isHost={!imHost} isReady={peer.isReady}>
          {imHost ? (peerNickName ? (peer.isReady ? 'READY' : 'NOT READY') : 'WAITING') : '👑 HOST'}
        </ReadyState>
      </Wrapper>
      {/* <Chatting /> */}
    </Container>
  );
}

export default WaitingBox;
