import { useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import styled from 'styled-components';
import { imHostAtom, myNickNameAtom } from '../../app/atom';
import { gameAtom, GameStage, GameStatus, messageAtom } from '../../app/game';
import { peerAtom } from '../../app/peer';
import { useClientSocket } from '../../module/client-socket';

const Container = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 15%;
  width: 70%;
  height: 100%;
  font-size: 50px;
  font-weight: 800;
`;

let messageOrder: number;

function Announcer() {
  const imHost = useAtomValue(imHostAtom);
  const myNickName = useAtomValue(myNickNameAtom);
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
          console.log('round 끝');
          setGame((prev) => ({
            ...prev,
            // status: GameStatus.RESULT,
            status: GameStatus.WAITING,
          }));
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
        if (imHost) {
          setMessage('준비가 완료되면 게임을 시작해주세요');
        } else {
          setMessage('준비가 되면 READY 버튼을 눌러주세요');
        }
        break;
      case GameStatus.GAME:
        messageOrder = 0;
        gameMessage();
        break;
      case GameStatus.RESULT:
        // setMessage('게임 결과');
        // if (host) {
        //   setTimeout(() => {
        //     socket.emit('result');
        //   }, 2000);
        // }
        break;
      default:
        break; //temp
    }
  }, [game.stage, game.status]);

  return <Container>{message}</Container>;
}

export default Announcer;
