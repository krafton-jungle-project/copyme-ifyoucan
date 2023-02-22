import styled from 'styled-components';
import { useRef } from 'react';
import { useAtomValue } from 'jotai';
import { gameAtom } from '../../../app/game';
import { myNickNameAtom } from '../../../app/atom';
import { isStartAtom } from '../InGame';
import { peerAtom } from '../../../app/peer';
import MyScoreBar from './MyScoreBar';
import MyCanvas from './MyCanvas';
import PeerCanvas from './PeerCanvas';
import PeerScoreBar from './PeerScoreBar';
import Versus from './Versus';

const Container = styled.div<{ isStart: boolean }>`
  position: absolute;
  bottom: 0%;
  width: 100%;
  height: 80%;
  visibility: ${(props) => (props.isStart ? 'visible' : 'hidden')};
`;

const Wrapper = styled.div<{ isMe: boolean; isStart: boolean }>`
  position: absolute;
  left: ${(props) => (props.isMe ? (props.isStart ? '0%' : '-50%') : 'none')};
  right: ${(props) => (props.isMe ? 'none' : props.isStart ? '0%' : '-50%')};
  width: 45%;
  height: 100%;
  transition-property: left, right;
  transition-delay: 0.5s, 0.5s;
  transition-duration: 0.5s, 0.5s;
`;

const CameraWrapper = styled.div<{ isMe: boolean }>`
  position: absolute;
  left: ${(props) => (props.isMe ? '0%' : 'none')};
  right: ${(props) => (props.isMe ? 'none' : '0%')};
  width: calc(100% * (5 / 6));
  height: 100%;
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

const GameRole = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0%;
  width: 100%;
  height: 10%;
  font-size: 30px;
  font-weight: bold;
  color: #ffff99;
`;

function GameBox() {
  const game = useAtomValue(gameAtom);
  const myNickName = useAtomValue(myNickNameAtom);
  const peer = useAtomValue(peerAtom);
  const peerNickName = peer.nickName;
  const isStart = useAtomValue(isStartAtom);
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const peerVideoRef = useRef<HTMLVideoElement>(null);

  return (
    <Container isStart={isStart}>
      <Wrapper isMe={true} isStart={isStart}>
        <CameraWrapper isMe={true}>
          <NickNameBox>{myNickName}</NickNameBox>
          <MyCanvas myVideoRef={myVideoRef} />
          <GameRole>{game.isOffender ? '공격자' : '수비자'}</GameRole>
        </CameraWrapper>
        <MyScoreBar myVideoRef={myVideoRef} />
      </Wrapper>
      <Wrapper isMe={false} isStart={isStart}>
        <CameraWrapper isMe={false}>
          <NickNameBox>{peerNickName}</NickNameBox>
          <PeerCanvas peerVideoRef={peerVideoRef} />
          <GameRole>{game.isOffender ? '수비자' : '공격자'}</GameRole>
        </CameraWrapper>
        <PeerScoreBar />
      </Wrapper>
      <Versus />
    </Container>
  );
}

export default GameBox;
