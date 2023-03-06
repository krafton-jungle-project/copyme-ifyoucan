import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import { gameAtom, GameStage } from '../../../app/game';
import { peerInfoAtom } from '../../../app/peer';
import { roomInfoAtom } from '../../../app/room';
import arrowImg from '../../../assets/images/in-game/arrow.png';
import loseImg from '../../../assets/images/in-game/lose.gif';
import blurImg from '../../../assets/images/in-game/notice/blur.gif';
import gameOverImg from '../../../assets/images/in-game/notice/game-over.gif';
import normalImg from '../../../assets/images/in-game/notice/normal.png';
import rotateImg from '../../../assets/images/in-game/notice/rotate.gif';
import roundOneImg from '../../../assets/images/in-game/notice/round-one.gif';
import roundThreeImg from '../../../assets/images/in-game/notice/round-three.gif';
import roundTwoImg from '../../../assets/images/in-game/notice/round-two.gif';
import sizeDownImg from '../../../assets/images/in-game/notice/sizedown.gif';
import transitionImg from '../../../assets/images/in-game/notice/transition.gif';
import winImg from '../../../assets/images/in-game/win.gif';
import transparentImg from '../../../assets/images/transparent.png';
import { useClientSocket } from '../../../module/client-socket';
import { getUser } from '../../../utils/local-storage';
import {
  Coin,
  GameMusic,
  GameOver,
  Lose,
  Notice,
  RoundOne,
  RoundThree,
  RoundTwo,
  Transition,
  Win,
} from '../../../utils/sound';
import InvisibleDrawingCanvas from '../InvisibleDrawingCanvas';
import MyCanvas from './MyCanvas';
import MyScoreBar from './MyScoreBar';
import PeerCanvas from './PeerCanvas';
import PeerScoreBar from './PeerScoreBar';
import Versus from './Versus';

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
  background-color: #000b; //check: 실제 시연 환경에 맞게 밝기 조절 필요
  visibility: ${(props) => (props.visible ? 'visible' : 'hidden')};
`;

const NoticeImg = styled.img`
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
      -webkit-text-stroke: 2px #000;
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

const roundSound = [RoundOne, RoundTwo, RoundThree];
const roundImg = [roundOneImg, roundTwoImg, roundThreeImg];
const gameModeImg = [normalImg, blurImg, rotateImg, sizeDownImg];

function GameBox() {
  const myNickName = getUser().nickName;
  const game = useAtomValue(gameAtom);
  const { host, gameMode } = useAtomValue(roomInfoAtom);
  const { socket } = useClientSocket();
  const peerInfo = useAtomValue(peerInfoAtom);
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const peerVideoRef = useRef<HTMLVideoElement>(null);
  const [focus, setFocus] = useState('noMe');
  const [noticeImg, setNoticeImg] = useState(transparentImg);
  const [myJudgeImg, setMyJudgeImg] = useState(transparentImg);
  const [peerJudgeImg, setPeerJudgeImg] = useState(transparentImg);

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
    if (game.stage === GameStage.ROUND) {
      // 라운드 시작 및 게임 모드 안내
      if (game.round < 4) {
        roundSound[game.round - 1].play();
        setNoticeImg(roundImg[game.round - 1]);

        setTimeout(() => {
          Notice.play();
          const round = `round${game.round}` as keyof typeof gameMode;
          setNoticeImg(gameModeImg[gameMode[round]]);

          setTimeout(() => {
            setNoticeImg(transparentImg);

            if (host) {
              socket.emit('change_stage', GameStage.OFFEND);
            }
          }, 2500);
        }, 2500);
      }
      // 게임 종료 안내
      else {
        GameMusic.currentTime = 0;
        GameMusic.pause();
        GameOver.play();
        setNoticeImg(gameOverImg);

        setTimeout(() => {
          setNoticeImg(transparentImg);

          if (host) {
            socket.emit('potg');
          }
        }, 2000);
      }
    }
    // 공수 전환 안내
    else if (game.stage === GameStage.OFFEND) {
      // x.5 라운드
      if (game.round % 1 !== 0) {
        Transition.play();
        setNoticeImg(transitionImg);
      }

      setTimeout(() => {
        setNoticeImg(transparentImg);

        if (host) {
          socket.emit('count_down', 'offend');
        }
      }, 2000);
    } else if (game.stage === GameStage.DEFEND) {
      if (host) {
        socket.emit('count_down', 'defend');
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

          if (host) {
            socket.emit('point', socket.id);
          }
        } else {
          Lose.play();
          setMyJudgeImg(loseImg);
          setPeerJudgeImg(winImg);

          if (host) {
            socket.emit('point', peerInfo.socketId);
          }
        }

        setTimeout(() => {
          setMyJudgeImg(transparentImg);
          setPeerJudgeImg(transparentImg);

          if (host) {
            socket.emit('change_stage', GameStage.ROUND);
          }
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
      <NoticeImg alt="notice image" src={noticeImg} />
      <Judge isJudgement={game.stage === GameStage.JUDGE}>
        {game.user.score >= game.peer.score ? '>' : '<'}
      </Judge>
      <Wrapper isMe={false} isStart={game.isStart}>
        <PeerScoreBar />
        <CameraWrapper isMe={false}>
          <GameRole isMe={false} focus={focus}>
            {game.user.isOffender ? '수비자' : '공격자'}
          </GameRole>
          <NickNameBox>{peerInfo.nickName}</NickNameBox>
          <PeerCanvas peerVideoRef={peerVideoRef} />
          <PeerJudgeImg alt="peer judge image" src={peerJudgeImg} />
        </CameraWrapper>
      </Wrapper>
      <InvisibleDrawingCanvas />
      <FadeBackGround visible={noticeImg !== transparentImg || game.stage === GameStage.JUDGE} />
    </Container>
  );
}

export default GameBox;
