import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { gameAtom, GameStage } from '../../app/game';
import { peerInfoAtom } from '../../app/peer';
import { useClientSocket } from '../../module/client-socket';
import { roomInfoAtom } from '../../app/room';
import { myNickName } from '../../pages/Lobby';

const Container = styled.div<{ isStart: boolean }>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 50%;
  transform: translate(-50%);
  width: ${(props) => (props.isStart ? '50%' : '60%')};
  height: 100%;
  font-size: 2.8vw;
  font-weight: 400;

  border: 0.15rem solid #fff;
  border-radius: 2rem;
  padding: 0.4em;
  box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 1rem #bc13fe, 0 0 0.4rem #bc13fe,
    0 0 1.4rem #bc13fe, inset 0 0 0.6rem #bc13fe;

  color: #fff;
  text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 30px #fff, 0 0 60px #bc13fe, 0 0 120px #bc13fe,
    0 0 92px #bc13fe, 0 0 102px #bc13fe, 0 0 151px #bc13fe;

  transition: 0.5s;
  transition-delay: ${(props) => (props.isStart ? 'none' : '0.5s')};
`;

function Announcer() {
  const host = useAtomValue(roomInfoAtom).host;
  const peerInfo = useAtomValue(peerInfoAtom);
  const { socket } = useClientSocket();
  const [game, setGame] = useAtom(gameAtom);
  const [message, setMessage] = useState('');

  // 대기실
  useEffect(() => {
    if (!game.isStart) {
      //temp 게임 대기 중
      if (game.round < 4) {
        // 내가 방장일 때
        if (host) {
          // 아직 상대가 입장하지 않았으면
          if (!peerInfo.socketId) {
            setMessage('상대방이 입장하지 않았습니다');
          }
          // 상대방이 입장했을 때
          else {
            // 상대방이 준비되지 않았으면
            if (!game.peer.isReady) {
              setMessage('상대방이 아직 준비되지 않았습니다');
            }
            // 상대방이 준비되었으면
            else {
              // 내가 전신이 나오지 않았으면
              if (!game.user.isValidBody) {
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
          if (!game.user.isValidBody) {
            setMessage('전신이 나오도록 서주세요');
          }
          // 내가 전신이 나오게 섰으면
          else {
            // 내가 왼손을 안올리고 있으면
            if (!game.user.isReady) {
              setMessage('준비가 되면 왼손을 올려주세요');
            }
            // 내가 왼손을 올리고 있으면
            else {
              setMessage('상대도 손을 올리면 게임이 시작됩니다');
            }
          }
        }
      }
      //temp 게임 결과를 보여줄 때
      else {
        setMessage('PLAY OF THE GAME');
      }
    }
  }, [
    host,
    peerInfo.socketId,
    game.isStart,
    game.user.isValidBody,
    game.user.isReady,
    game.peer.isReady,
    game.round,
  ]);

  // 게임중
  useEffect(() => {
    const gameMessage = () => {
      const initialMessages: string[] = [
        '게임을 시작합니다',
        '첫 번째 공격이 시작됩니다!',
        '자세를 정확히 따라해주세요!',
      ];

      switch (game.stage) {
        case GameStage.INITIAL:
          if (messageOrder < initialMessages.length) {
            setMessage(initialMessages[messageOrder++]);

            setTimeout(gameMessage, 2000);
          } else {
            messageOrder = 0;

            if (host) {
              socket.emit('change_stage', GameStage.ROUND);
            }
          }
          break;
        case GameStage.ROUND:
          if (game.round < 4) {
            setMessage(`ROUND ${game.round}`);

            //todo: 위치 빈경 필요
            // 라운드 시작 시 점수 초기화
            setTimeout(() => {
              setGame((prev) => ({
                ...prev,
                user: { ...prev.user, score: 0 },
                peer: { ...prev.peer, score: 0 },
              }));
            }, 1000);

            setTimeout(() => {
              if (host) {
                socket.emit('change_stage', GameStage.OFFEND);
              }
            }, 2500);
          }
          // 3(3.5) 라운드가 모두 끝났을 때(게임 종료)
          else {
            setMessage('GAME OVER');

            if (host) {
              setTimeout(() => {
                socket.emit('result');
              }, 2500);
            }
          }
          break;
        case GameStage.OFFEND:
          // 공수 전환
          if (game.round % 1 !== 0) {
            setMessage('공격 수비 전환');

            setTimeout(() => {
              setMessage(`${game.user.isOffender ? myNickName : peerInfo.nickName}님의 공격!`);
              setTimeout(() => {
                if (host) {
                  socket.emit('count_down', 'offend');
                }
              }, 1500);
            }, 2000);
          } else {
            setTimeout(() => {
              setMessage(`${game.user.isOffender ? myNickName : peerInfo.nickName}님의 공격!`);

              setTimeout(() => {
                if (host) {
                  socket.emit('count_down', 'offend');
                }
              }, 1500);
            }, 2000);
          }

          break;
        case GameStage.DEFEND:
          setMessage(`${game.user.isOffender ? peerInfo.nickName : myNickName}님의 수비!`);

          setTimeout(() => {
            if (host) {
              socket.emit('count_down', 'defend');
            }
          }, 1500);
          break;
        default:
          break;
      }
    };

    let messageOrder: number;

    if (game.isStart) {
      messageOrder = 0;
      gameMessage();
    }
  }, [game.isStart, game.stage]);

  return <Container isStart={game.isStart}>{message}</Container>;
}

export default Announcer;
