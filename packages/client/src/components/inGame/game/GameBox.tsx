import styled, { css, keyframes } from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { useAtomValue } from 'jotai';
import { gameAtom, GameStage } from '../../../app/game';
import { peerInfoAtom } from '../../../app/peer';
import MyScoreBar from './MyScoreBar';
import MyCanvas from './MyCanvas';
import PeerCanvas from './PeerCanvas';
import PeerScoreBar from './PeerScoreBar';
import Versus from './Versus';
import { myNickName } from '../../../pages/Lobby';
import arrow from '../../../assets/images/arrow.png';
import InvisibleDrawingCanvas from '../InvisibleDrawingCanvas';

const Container = styled.div<{ isStart: boolean }>`
  position: absolute;
  bottom: 0%;
  width: 100%;
  height: 80%;
  visibility: ${(props) => (props.isStart ? 'visible' : 'hidden')};
`;

const Wrapper = styled.div<{ isMe: boolean; isStart: boolean }>`
  position: absolute;
  left: ${(props) => (props.isMe ? (props.isStart ? '0%' : '-60%') : 'none')};
  right: ${(props) => (props.isMe ? 'none' : props.isStart ? '0%' : '-60%')};
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

const textHighlight = keyframes`
  0%, 100% {
    text-shadow: 0 0 1px #f4ff00, 0 0 2px #f4ff00;

  }
  50% {
    text-shadow: 0 0 3px #f4ff00, 0 0 6px #f4ff00;
  }
`;

const GameRole = styled.div<{ isMe: boolean; focus: string }>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 0%;
  width: 100%;
  height: 10%;
  font-size: 35px;
  font-weight: bold;
  color: #f4ff00aa;

  /* color: ${(props) => (props.focus === 'me' ? 1 : 1)}; */

  ${(props) =>
    ((props.isMe && props.focus === 'me') || (!props.isMe && props.focus === 'peer')) &&
    css`
      color: #f4ff00;
      animation: ${textHighlight} 1.6s linear infinite;
    `}

  transition: 0.5s;
`;

const NickNameBox = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0%;
  width: 100%;
  height: 10%;
  font-size: 35px;
  font-weight: bold;
`;

const blinkAnimate = keyframes`
  0%, 100% {
    box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 1rem #cef205, 0 0 0.4rem #cef205,
        0 0 1.4rem #cef205, inset 0 0 0.6rem #cef205;
  }
  50% {
    box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #cef205, 0 0 0.8rem #cef205,
        0 0 2.8rem #cef205, inset 0 0 1.3rem #cef205;
  }
`;

const CameraFocus = styled.div<{ focus: string }>`
  position: absolute;
  left: ${(props) => (props.focus === 'me' || props.focus === 'noMe' ? '-2%' : 'none')};
  right: ${(props) => (props.focus === 'peer' || props.focus === 'noPeer' ? '-2%' : 'none')};
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
    (props.focus === 'me' || props.focus === 'peer') &&
    css`
      animation: ${blinkAnimate} 0.8s linear infinite;
    `}

  transition: 0.5s;
`;

const upDownAnimate = keyframes`
  0%, 100% {
    top: -25%;
  }
  50% {
    top: -20%;
  }
`;

const HighlightArrow = styled.img<{ focus: string }>`
  position: absolute;
  visibility: hidden;
  top: -25%;
  height: 20%;
  animation: ${upDownAnimate} 0.5s linear infinite;

  ${(props) =>
    props.focus === 'me' &&
    css`
      visibility: visible;
      left: 15%;
    `}
  ${(props) =>
    props.focus === 'peer' &&
    css`
      visibility: visible;
      right: 15%;
    `}
`;

function GameBox() {
  const game = useAtomValue(gameAtom);
  const peerNickName = useAtomValue(peerInfoAtom).nickName;
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const peerVideoRef = useRef<HTMLVideoElement>(null);
  const [focus, setFocus] = useState('noMe');

  useEffect(() => {
    if (
      (game.stage === GameStage.OFFEND && game.user.isOffender) ||
      (game.stage === GameStage.DEFEND && !game.user.isOffender)
    ) {
      if (game.countDown !== 0) {
        setFocus('me');
      } else {
        // 강조는 꺼지되 위치는 변경하지 않기 위함
        setFocus('noMe');
      }
    } else if (
      (game.stage === GameStage.OFFEND && !game.user.isOffender) ||
      (game.stage === GameStage.DEFEND && game.user.isOffender)
    ) {
      if (game.countDown !== 0) {
        setFocus('peer');
      } else {
        // 강조는 꺼지되 위치는 변경하지 않기 위함
        setFocus('noPeer');
      }
    } else {
      setFocus('noPeer');
    }
  }, [game.stage, game.countDown]);

  return (
    <Container isStart={game.isStart}>
      <CameraFocus focus={focus} />
      <HighlightArrow src={arrow} focus={focus} />
      <Versus />
      <Wrapper isMe={true} isStart={game.isStart}>
        <MyScoreBar myVideoRef={myVideoRef} />
        <CameraWrapper isMe={true}>
          <GameRole isMe={true} focus={focus}>
            {game.user.isOffender ? '공격자' : '수비자'}
          </GameRole>
          <NickNameBox>{myNickName}</NickNameBox>
          <MyCanvas myVideoRef={myVideoRef} />
        </CameraWrapper>
      </Wrapper>
      <Wrapper isMe={false} isStart={game.isStart}>
        <PeerScoreBar />
        <CameraWrapper isMe={false}>
          <GameRole isMe={false} focus={focus}>
            {game.user.isOffender ? '수비자' : '공격자'}
          </GameRole>
          <NickNameBox>{peerNickName}</NickNameBox>
          <PeerCanvas peerVideoRef={peerVideoRef} />
        </CameraWrapper>
      </Wrapper>
      {/* <InvisibleDrawingCanvas /> */}
    </Container>
  );
}

export default GameBox;
