import styled, { css } from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { countDownAtom, gameAtom, GameStage } from '../../../app/game';
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
  font-size: 35px;
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
  font-size: 35px;
  font-weight: bold;
  color: #ffff99;
`;

const CameraFocus = styled.div<{ focus: string; light: boolean }>`
  position: absolute;
  left: ${(props) => (props.focus === 'noMe' ? '-2%' : 'none')};
  right: ${(props) => (props.focus === 'noPeer' ? '-2%' : 'none')};
  width: 48%;
  height: 100%;
  border-radius: 20px;

  ${(props) =>
    (props.focus === 'noMe' || props.focus === 'noPeer') &&
    css`
      visibility: 'hidden';
      box-shadow: 0;
    `}
  ${(props) =>
    props.focus === 'me' &&
    props.light &&
    css`
      left: -2%;
      box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #ff3131, 0 0 0.8rem #ff3131,
        0 0 2.8rem #ff3131, inset 0 0 1.3rem #ff3131;
    `}
  ${(props) =>
    props.focus === 'me' &&
    !props.light &&
    css`
      left: -2%;
      box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 1rem #ff3131, 0 0 0.4rem #ff3131,
        0 0 1.4rem #ff3131, inset 0 0 0.6rem #ff3131;
    `}
  ${(props) =>
    props.focus === 'peer' &&
    props.light &&
    css`
      right: -2%;
      box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #1f51ff, 0 0 0.8rem #1f51ff,
        0 0 2.8rem #1f51ff, inset 0 0 1.3rem #1f51ff;
    `}
  ${(props) =>
    props.focus === 'peer' &&
    !props.light &&
    css`
      right: -2%;
      box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 1rem #1f51ff, 0 0 0.4rem #1f51ff,
        0 0 1.4rem #1f51ff, inset 0 0 0.6rem #1f51ff;
    `}

  transition: 1s;
`;

function GameBox() {
  const game = useAtomValue(gameAtom);
  const myNickName = useAtomValue(myNickNameAtom);
  const peer = useAtomValue(peerAtom);
  const peerNickName = peer.nickName;
  const isStart = useAtomValue(isStartAtom);
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const peerVideoRef = useRef<HTMLVideoElement>(null);

  const [focus, setFocus] = useState('noMe');
  const countDown = useAtomValue(countDownAtom);

  useEffect(() => {
    if (
      (game.stage === GameStage.OFFEND && game.isOffender) ||
      (game.stage === GameStage.DEFEND && !game.isOffender)
    ) {
      if (countDown !== 0) {
        setFocus('me');
      } else {
        setTimeout(() => {
          setFocus('noMe');
        }, 500);
      }
    } else if (
      (game.stage === GameStage.OFFEND && !game.isOffender) ||
      (game.stage === GameStage.DEFEND && game.isOffender)
    ) {
      if (countDown !== 0) {
        setFocus('peer');
      } else {
        setTimeout(() => {
          setFocus('noPeer');
        }, 500);
      }
    } else {
      setFocus('noPeer');
    }
  }, [game.stage, countDown]);

  return (
    <Container isStart={isStart}>
      <CameraFocus focus={focus} light={countDown % 2 === 1} />
      <Wrapper isMe={true} isStart={isStart}>
        <MyScoreBar myVideoRef={myVideoRef} />
        <CameraWrapper isMe={true}>
          <NickNameBox>{myNickName}</NickNameBox>
          <GameRole>{game.isOffender ? '공격자' : '수비자'}</GameRole>
          <MyCanvas myVideoRef={myVideoRef} />
        </CameraWrapper>
      </Wrapper>
      <Wrapper isMe={false} isStart={isStart}>
        <PeerScoreBar />
        <CameraWrapper isMe={false}>
          <NickNameBox>{peerNickName}</NickNameBox>
          <GameRole>{game.isOffender ? '수비자' : '공격자'}</GameRole>
          <PeerCanvas peerVideoRef={peerVideoRef} />
        </CameraWrapper>
      </Wrapper>
      <Versus />
    </Container>
  );
}

export default GameBox;
