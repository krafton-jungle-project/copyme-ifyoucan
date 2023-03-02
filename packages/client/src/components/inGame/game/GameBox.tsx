import styled, { css, keyframes } from 'styled-components';
import { useEffect, useRef, useState } from 'react';
import { useAtom, useAtomValue } from 'jotai';
import { gameAtom, GameStage } from '../../../app/game';
import { peerInfoAtom } from '../../../app/peer';
import MyScoreBar from './MyScoreBar';
import MyCanvas from './MyCanvas';
import PeerCanvas from './PeerCanvas';
import PeerScoreBar from './PeerScoreBar';
import Versus from './Versus';
import { myNickName } from '../../../pages/Lobby';
import arrowImg from '../../../assets/images/arrow.png';
import InvisibleDrawingCanvas from '../InvisibleDrawingCanvas';
import transparentImg from '../../../assets/images/transparent.png';
import roundOneImg from '../../../assets/images/round-one.gif';
import roundTwoImg from '../../../assets/images/round-two.gif';
import roundThreeImg from '../../../assets/images/round-three.gif';
import transitionImg from '../../../assets/images/transition.gif';
import winImg from '../../../assets/images/win.gif';
import loseImg from '../../../assets/images/lose.gif';
import gameOverImg from '../../../assets/images/game-over.gif';
import {
  Coin,
  GameMusic,
  GameOver,
  Lose,
  RoundOne,
  RoundThree,
  RoundTwo,
  Transition,
  Win,
} from '../../../utils/sound';
import { useClientSocket } from '../../../module/client-socket';

const Container = styled.div<{ isStart: boolean }>`
  position: absolute;
  bottom: 0;
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
  transition: 0.5s;
  transition-delay: ${(props) => (props.isStart ? '0.5s' : 'none')};
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
  top: 0;
  width: 100%;
  height: 10%;
  font-size: 35px;
  font-weight: bold;
  color: #f4ff00aa;

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
  bottom: 0;
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
    top: -28%;
  }
  50% {
    top: -23%;
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

const FadeBackGround = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 200%;
  height: 200%;
  background-color: rgba(0, 0, 0, 0.6);
  border: 5px solid white;
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
`;

const RoundImg = styled.img`
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
`;

const Judge = styled.p<{ isJudgement: boolean }>`
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0;
  transition: 0.5s;

  ${(props) =>
    props.isJudgement &&
    css`
      font-size: 100px;
      font-weight: 800;
      -webkit-text-stroke: 2px black;
      text-shadow: 0 0 5px #fff, 0 0 5px #fff, 0 0 5px #fff, 0 0 5px #fff, 0 0 5px #fff;
    `}
`;

const MyJudgeImg = styled.img`
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
`;

const PeerJudgeImg = styled.img`
  position: absolute;
  z-index: 1;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
`;

function GameBox() {
  const [game, setGame] = useAtom(gameAtom);
  const { socket } = useClientSocket();
  const peerNickName = useAtomValue(peerInfoAtom).nickName;
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const peerVideoRef = useRef<HTMLVideoElement>(null);
  const [focus, setFocus] = useState('noMe');
  let [roundImg, setRoundImg] = useState(transparentImg);
  let [myJudgeImg, setMyJudgeImg] = useState(transparentImg);
  let [peerJudgeImg, setPeerJudgeImg] = useState(transparentImg);

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

  useEffect(() => {
    // 라운드 시작 안내
    if (game.stage === GameStage.ROUND) {
      switch (game.round) {
        case 1:
          RoundOne.play();
          setRoundImg(roundOneImg);
          break;
        case 2:
          RoundTwo.play();
          setRoundImg(roundTwoImg);
          break;
        case 3:
          RoundThree.play();
          setRoundImg(roundThreeImg);
          break;
        case 4:
          GameMusic.currentTime = 0;
          GameMusic.pause();
          GameOver.play();
          setRoundImg(gameOverImg);
          break;
        default:
          break;
      }
      setTimeout(() => {
        setRoundImg(transparentImg);
      }, 2000);
    }
    // 공수 전환 안내
    else if (game.stage === GameStage.OFFEND) {
      // x.5 라운드
      if (game.round % 1 !== 0) {
        Transition.play();
        setRoundImg(transitionImg);
        setTimeout(() => {
          setRoundImg(transparentImg);
        }, 2000);
      }
    }
    // 라운드 종료 후 승패 판정
    else if (game.stage === GameStage.JUDGE) {
      Coin.play();

      setTimeout(() => {
        if (game.user.score >= game.peer.score) {
          Win.play();
          setMyJudgeImg(winImg);
          setPeerJudgeImg(loseImg);
          setGame((prev) => ({ ...prev, user: { ...prev.user, point: prev.user.point + 1 } }));
        } else {
          Lose.play();
          setMyJudgeImg(loseImg);
          setPeerJudgeImg(winImg);
          setGame((prev) => ({ ...prev, peer: { ...prev.peer, point: prev.peer.point + 1 } }));
        }
        setTimeout(() => {
          setMyJudgeImg(transparentImg);
          setPeerJudgeImg(transparentImg);
          socket.emit('change_stage', GameStage.ROUND);
        }, 2500);
      }, 1500);
    }
  }, [game.stage, game.round]);

  return (
    <Container isStart={game.isStart}>
      <CameraFocus focus={focus} />
      <HighlightArrow src={arrowImg} focus={focus} />
      <Versus />
      <Wrapper isMe={true} isStart={game.isStart}>
        <MyScoreBar myVideoRef={myVideoRef} />
        <CameraWrapper isMe={true}>
          <GameRole isMe={true} focus={focus}>
            {game.user.isOffender ? '공격자' : '수비자'}
          </GameRole>
          <NickNameBox>{myNickName}</NickNameBox>
          <MyCanvas myVideoRef={myVideoRef} />
          <MyJudgeImg alt="my judge image" src={myJudgeImg} />
        </CameraWrapper>
      </Wrapper>
      <RoundImg alt="round image" src={roundImg} />
      <Judge isJudgement={game.stage === GameStage.JUDGE}>
        {game.user.score >= game.peer.score ? '>' : '<'}
      </Judge>
      <Wrapper isMe={false} isStart={game.isStart}>
        <PeerScoreBar />
        <CameraWrapper isMe={false}>
          <GameRole isMe={false} focus={focus}>
            {game.user.isOffender ? '수비자' : '공격자'}
          </GameRole>
          <NickNameBox>{peerNickName}</NickNameBox>
          <PeerCanvas peerVideoRef={peerVideoRef} />
          <PeerJudgeImg alt="peer judge image" src={peerJudgeImg} />
        </CameraWrapper>
      </Wrapper>
      <InvisibleDrawingCanvas />
      <FadeBackGround visible={roundImg !== transparentImg || game.stage === GameStage.JUDGE} />
    </Container>
  );
}

export default GameBox;
