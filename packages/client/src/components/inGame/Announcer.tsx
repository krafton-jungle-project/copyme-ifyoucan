import { useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import styled from 'styled-components';
import { hostAtom, nickNameAtom } from '../../app/atom';
import { gameAtom, GameStage, GameStatus, messageAtom } from '../../app/game';
import { peerAtom } from '../../app/peer';
import { useClientSocket } from '../../module/client-socket';

const Div = styled.div`
  position: absolute;
  border: 5px solid yellow;
  background-color: #bfbf3042;
  top: 5%;
  left: 10%;
  width: 80%;
  height: 15%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 60px;
  font-weight: 800;
  transition-property: top;
  transition-duration: 1s;
`;

let messageOrder: number;

function Announcer() {
  const host = useAtomValue(hostAtom);
  const myNickName = useAtomValue(nickNameAtom);
  const peerNickName = useAtomValue(peerAtom).nickName;
  const { socket } = useClientSocket();

  const [game, setGame] = useAtom(gameAtom);
  const [message, setMessage] = useAtom(messageAtom);

  const initialMessages: string[] = [
    '게임을 시작합니다',
    '첫 번째 공격이 시작됩니다!',
    '공격자의 자세를 정확히 따라해주세요!',
  ];

  const offenderMessages: string[] = [`${game.isOffender ? myNickName : peerNickName}님의 공격!`];
  const defenderMessages: string[] = [`${game.isOffender ? peerNickName : myNickName}님의 수비!`];

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
        if (game.round >= 3) {
          console.log('round 끝');
          setGame((prev) => ({
            ...prev,
            status: GameStatus.RESULT,
          }));
        } else {
          if (messageOrder < offenderMessages.length) {
            setMessage(offenderMessages[messageOrder++]);
            setTimeout(gameMessage, 2000);
          } else {
            messageOrder = 0;

            setGame((prev) => ({
              ...prev,
              stage: GameStage.OFFEND_COUNTDOWN,
            }));

            if (host) {
              socket.emit('count_down', 'offend');
            }
          }
        }
        break;
      case GameStage.DEFEND_ANNOUNCEMENT:
        if (messageOrder < defenderMessages.length) {
          setMessage(defenderMessages[messageOrder++]);
          setTimeout(gameMessage, 2000);
        } else {
          messageOrder = 0;

          setGame((prev) => ({
            ...prev,
            stage: GameStage.DEFEND_COUNTDOWN,
          }));

          if (host) {
            socket.emit('count_down', 'defend');
            console.log('emit count down');
          }
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    switch (game.status) {
      case GameStatus.WAITING:
        if (host) {
          setMessage('모두 준비가 완료되면 게임을 시작해주세요');
        } else {
          setMessage('준비가 완료되면 READY 버튼을 눌러주세요');
        }
        break;
      case GameStatus.GAME:
        messageOrder = 0;
        gameMessage();
        break;
      case GameStatus.RESULT:
        setMessage('게임 결과');
        break;
      default:
        break; //temp
    }
  }, [game.stage, game.status]);

  return <Div>{message}</Div>;
}

export default Announcer;
