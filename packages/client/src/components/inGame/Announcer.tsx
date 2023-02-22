import { useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import styled from 'styled-components';
import { imHostAtom, myNickNameAtom } from '../../app/atom';
import { gameAtom, GameStage, GameStatus, messageAtom } from '../../app/game';
import { peerAtom } from '../../app/peer';
import { useClientSocket } from '../../module/client-socket';
import { imValidBodyAtom } from './waiting/MotionReady';
import { imReadyAtom } from './Logo'

const Container = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 15%;
  width: 70%;
  height: 100%;
  font-size: 50px;
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
  const peer = useAtomValue(peerAtom);
  const { socket } = useClientSocket();
  const [game, setGame] = useAtom(gameAtom);
  const [message, setMessage] = useAtom(messageAtom);
  const imValidBody = useAtomValue(imValidBodyAtom);
  const imReady = useAtomValue(imReadyAtom);

  const initialMessages: string[] = [
    '게임을 시작합니다',
    '첫 번째 공격이 시작됩니다!',
    '공격자의 자세를 정확히 따라해주세요!',
  ];

  const offenderMessages: string[] = [`${game.isOffender ? myNickName : peer.nickName}님의 공격!`];
  const defenderMessages: string[] = [`${game.isOffender ? peer.nickName : myNickName}님의 수비!`];

  const gameMessage = () => {
    switch (game.stage) {
      case GameStage.INITIAL_ANNOUNCEMENT:
        if (messageOrder < initialMessages.length) {
          setMessage(initialMessages[messageOrder++]);
          setTimeout(gameMessage, 1500);
        } else {
          messageOrder = 0;
          setGame((prev) => ({
            ...prev,
            stage: GameStage.OFFEND_ANNOUNCEMENT,
          }));
        }
        break;
      case GameStage.OFFEND_ANNOUNCEMENT:
        if (game.round < 3) {
          if (messageOrder < offenderMessages.length) {
            setTimeout(() => {
              setMessage(offenderMessages[messageOrder++]);
              setTimeout(gameMessage, 2000);
            }, 1000);
          } else {
            messageOrder = 0;

            setGame((prev) => ({
              ...prev,
              stage: GameStage.OFFEND_COUNTDOWN,
            }));

            if (imHost) {
              socket.emit('count_down', 'offend');
            }
          }
        } else {
          // 게임 끝
          console.log('round 끝');
          setTimeout(() => {
            setGame((prev) => ({
              ...prev,
              // status: GameStatus.RESULT,
              status: GameStatus.WAITING,
            }));
          }, 1000);
        }
        break;
      case GameStage.DEFEND_ANNOUNCEMENT:
        if (messageOrder < defenderMessages.length) {
          setTimeout(() => {
            setMessage(defenderMessages[messageOrder++]);
            setTimeout(gameMessage, 2000);
          }, 1000);
        } else {
          messageOrder = 0;

          setGame((prev) => ({
            ...prev,
            stage: GameStage.DEFEND_COUNTDOWN,
          }));

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
