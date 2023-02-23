import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import styled from 'styled-components';
import { imHostAtom, myNickNameAtom } from '../../app/atom';
import { gameAtom, GameStage, GameStatus, messageAtom, myScoreAtom } from '../../app/game';
import { peerAtom } from '../../app/peer';
import { useClientSocket } from '../../module/client-socket';
import { imValidBodyAtom } from './waiting/MotionReady';
import { imReadyAtom } from './Logo';
import { RoundOne, RoundThree, RoundTwo } from '../../utils/sound';

const Container = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 15%;
  width: 70%;
  height: 100%;
  font-size: 3vw;
  font-weight: 400;

  border: 0.2rem solid #fff;
  border-radius: 2rem;
  padding: 0.4em;
  box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #bc13fe, 0 0 0.8rem #bc13fe,
    0 0 2.8rem #bc13fe, inset 0 0 1.3rem #bc13fe;

  color: #fff;
  text-shadow: /* White glow */ 0 0 5px #fff, 0 0 20px #fff, 0 0 50px #fff,
    /* Green glow */ 0 0 42px #bc13fe, 0 0 120px #bc13fe, 0 0 92px #bc13fe, 0 0 102px #bc13fe,
    0 0 151px #bc13fe;
`;

let messageOrder: number;

function Announcer() {
  const imHost = useAtomValue(imHostAtom);
  const myNickName = useAtomValue(myNickNameAtom);
  const [peer, setPeer] = useAtom(peerAtom);
  const { socket } = useClientSocket();
  const game = useAtomValue(gameAtom);
  const [message, setMessage] = useAtom(messageAtom);
  const imValidBody = useAtomValue(imValidBodyAtom);
  const imReady = useAtomValue(imReadyAtom);
  const setMyScore = useSetAtom(myScoreAtom);

  const initialMessages: string[] = [
    '게임을 시작합니다',
    '첫 번째 공격이 시작됩니다!',
    '공격자의 자세를 정확히 따라해주세요!',
  ];

  const offenderMessages: string[] = [`${game.isOffender ? myNickName : peer.nickName}님의 공격!`];
  const defenderMessages: string[] = [`${game.isOffender ? peer.nickName : myNickName}님의 수비!`];

  const gameMessage = () => {
    switch (game.stage) {
      case GameStage.INITIAL:
        if (messageOrder < initialMessages.length) {
          setMessage(initialMessages[messageOrder++]);
          setTimeout(gameMessage, 2000);
        } else {
          messageOrder = 0;
          if (imHost) {
            socket.emit('change_stage', GameStage.ROUND);
          }
        }
        break;
      case GameStage.ROUND:
        if (game.round < 4) {
          if (game.round === 1) RoundOne.play();
          else if (game.round === 2) RoundTwo.play();
          else if (game.round === 3) RoundThree.play();

          setMessage(`ROUND ${game.round} START!`);

          // 라운드 시작 시 점수 초기화
          setTimeout(() => {
            setMyScore(0);
            setPeer((prev) => ({ ...prev, score: 0 }));
          }, 1500);

          setTimeout(() => {
            if (imHost) {
              socket.emit('change_stage', GameStage.OFFEND);
            }
          }, 3000);
        } else {
          // 게임 끝
          console.log('finish');
          if (imHost) {
            socket.emit('finish');
          }
        }
        break;
      case GameStage.OFFEND:
        if (messageOrder < offenderMessages.length) {
          setMessage(offenderMessages[messageOrder++]);
          setTimeout(gameMessage, 2000);
        } else {
          messageOrder = 0;
          if (imHost) {
            socket.emit('count_down', 'offend');
          }
        }
        break;
      case GameStage.DEFEND:
        if (messageOrder < defenderMessages.length) {
          setMessage(defenderMessages[messageOrder++]);
          setTimeout(gameMessage, 2000);
        } else {
          messageOrder = 0;
          if (imHost) {
            socket.emit('count_down', 'defend');
          }
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    switch (game.status) {
      // 게임방 대기실에서
      case GameStatus.WAITING:
        // 내가 방장일 때
        if (imHost) {
          // 아직 상대가 입장하지 않았으면
          if (!peer.socketId) {
            setMessage('상대방이 입장하지 않았습니다');
          }
          // 상대방이 입장했을 때
          else {
            // 상대방이 준비되지 않았으면
            if (!peer.isReady) {
              setMessage('상대방이 아직 준비되지 않았습니다');
            }
            // 상대방이 준비되었으면
            else {
              // 내가 전신이 나오지 않았으면
              if (!imValidBody) {
                setMessage('전신이 나오도록 서주세요');
              }
              // 내가 전신이 나오게 섰으면(상대방은 레디한 상태)
              else {
                setMessage('왼손을 올려 게임을 시작해주세요');
              }
            }
          }
        }
        // 방장이 아닐때
        else {
          // 내가 전신이 나오지 않았으면
          if (!imValidBody) {
            setMessage('전신이 나오도록 서주세요');
          }
          // 내가 전신이 나오게 섰으면
          else {
            // 내가 왼손을 안올리고 있으면
            if (!imReady) {
              setMessage('준비가 되면 왼손을 올려주세요');
            }
            // 내가 왼손을 올리고 있으면
            else {
              setMessage('상대도 손을 올리면 게임이 시작됩니다');
            }
          }
        }
        break;
      case GameStatus.GAME:
        messageOrder = 0;
        gameMessage();
        break;
      case GameStatus.RESULT:
        setMessage('게임 결과');

        //todo: 게임 종료 사운드
        //todo: 게임 종료 안내 멘트(game over)
        //todo: 등등 추가 필요

        if (imHost) {
          setTimeout(() => {
            socket.emit('result');
          }, 2000);
        }
        break;
      default:
        break; //temp
    }
  }, [game.status, game.stage, imReady, peer.socketId, peer.isReady, imValidBody]);

  return <Container>{message}</Container>;
}

export default Announcer;
