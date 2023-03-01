import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useClientSocket } from '../../module/client-socket';
import { gameAtom, GameStage } from '../../app/game';
import {
  BackgroundMusic,
  Bell,
  CameraClick,
  CountDown,
  GameMusic,
  GunReload,
  POTG,
  Swish,
} from '../../utils/sound';
import { useResetAtom } from 'jotai/utils';
import { roomInfoAtom } from '../../app/room';
import { prevBgmState } from '../../pages/Lobby';

const GameEventHandler = () => {
  const { socket } = useClientSocket();
  const host = useAtomValue(roomInfoAtom).host;
  const setGame = useSetAtom(gameAtom);
  const resetGame = useResetAtom(gameAtom);

  useEffect(() => {
    socket.on('get_ready', () => {
      GunReload.play();
      setGame((prev) => ({ ...prev, peer: { ...prev.peer, isReady: true } }));
    });

    socket.on('get_unready', () => {
      GunReload.play();
      setGame((prev) => ({ ...prev, peer: { ...prev.peer, isReady: false } }));
    });

    // 게임 Status를 waiting에서 game으로 바꾼다
    socket.on('get_start', () => {
      setGame((prev) => ({
        ...prev,
        user: { ...prev.user, isOffender: host ? true : false },
        isStart: true,
      }));

      BackgroundMusic.pause();
      Swish.play(); // 비디오 휙 넘어가는 소리

      setTimeout(() => {
        Bell.play(); // 게임 시작 시 '땡땡땡' 복싱 벨 울리는 소리
      }, 1000);

      setTimeout(() => {
        GameMusic.play(); // 게임 배경음악
        GameMusic.volume = 0.5;
      }, 1500);
    });

    socket.on('get_count_down', (count: number, stage: string) => {
      setGame((prev) => ({ ...prev, countDown: count }));

      if (count === 5) {
        CountDown.play();
      }

      if (count === 0) {
        CameraClick.play();

        if (stage === 'offend') {
          // 라운드 전환
          setTimeout(() => {
            setGame((prev) => ({ ...prev, stage: GameStage.DEFEND }));
          }, 2500);
        }

        if (stage === 'defend') {
          // 공수 비교 이펙트(캡쳐된 공격자, 수비자 사진 확대 비교 및 grading)
          setTimeout(() => {
            // 카운트다운 0(캡쳐) 이후 1초 지났을 때 캡쳐된 사진 크기 키우고
            setGame((prev) => ({ ...prev, isCaptured: true }));

            setTimeout(() => {
              // 1초 뒤 수비자 캡쳐 사진에 grading 하고
              setGame((prev) => ({
                ...prev,
                user: { ...prev.user, gradable: prev.user.isOffender ? false : true },
                peer: { ...prev.peer, gradable: prev.user.isOffender ? true : false },
              }));

              // 1초 뒤 사진 다시 작게 하고, grading도 감추고
              setTimeout(() => {
                setGame((prev) => ({
                  ...prev,
                  isCaptured: false,
                  user: { ...prev.user, gradable: false },
                  peer: { ...prev.peer, gradable: false },
                }));

                // 0.5 라운드 증가(다음 라운드(+공수 전환) or 공수 전환)
                setTimeout(() => {
                  setGame((prev) => ({
                    ...prev,
                    stage: Number.isInteger(prev.round + 0.5) ? GameStage.ROUND : GameStage.OFFEND,
                    round: prev.round + 0.5,
                    user: { ...prev.user, isOffender: !prev.user.isOffender }, // 공수전환
                  }));
                }, 1000);
              }, 1000);
            }, 1000);
          }, 1000);
        }
      }
    });

    socket.on('get_score', (score: number) => {
      setGame((prev) => ({ ...prev, peer: { ...prev.peer, score } }));
    });

    socket.on('get_change_stage', (stage: number) => {
      setGame((prev) => ({ ...prev, stage }));
    });

    // 아이템 라운드 관리
    socket.on('get_item_type', (ItemType: number) => {
      setGame((prev) => ({ ...prev, item_type: ItemType }));
    });

    // 게임이 끝났을 때
    socket.on('get_result', () => {
      POTG.play();
      // 게임 start 상태를 false로 바꿔서 결과를 보여주는 도중 상대가 나가도 튕기지 않게 하고
      // 화면을 GameBox에서 WaitingBox로 전환하여 결과를 채팅으로 보여줄 수 있도록 한다.
      setGame((prev) => ({ ...prev, isStart: false }));
    });

    // 게임 결과를 모두 보여줬을 때
    socket.on('get_finish', () => {
      if (prevBgmState) {
        POTG.currentTime = 0;
        POTG.pause();
        setTimeout(() => {
          BackgroundMusic.currentTime = 0;
          BackgroundMusic.play();
        }, 2000);

        resetGame();
      }
    });

    return () => {
      socket.removeAllListeners();
    };
  }, []);

  return null;
};

export default GameEventHandler;
