import { useEffect } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { useClientSocket } from '../../module/client-socket';
import { gameAtom, GameStage, GameStatus } from '../../app/game';
import { Bell, CameraClick, CountDown3s, GameMusic, GunReload, Swish } from '../../utils/sound';
import { useResetAtom } from 'jotai/utils';
import { roomInfoAtom } from '../../app/room';

const GameEventHandler = () => {
  const { socket } = useClientSocket();
  const host = useAtomValue(roomInfoAtom).host;
  const setGame = useSetAtom(gameAtom);
  const resetGame = useResetAtom(gameAtom);

  useEffect(() => {
    socket.on('get_ready', () => {
      GunReload.play();
      console.log('get_ready');
      setGame((prev) => ({ ...prev, peer: { ...prev.peer, isReady: true } }));
    });

    socket.on('get_unready', () => {
      GunReload.play();
      console.log('get_unready');
      setGame((prev) => ({ ...prev, peer: { ...prev.peer, isReady: false } }));
    });

    //! 게임 Status를 waiting에서 game으로 바꾼다
    socket.on('get_start', () => {
      console.log('get_start');

      setGame((prev) => ({
        ...prev,
        user: { ...prev.user, isOffender: host ? true : false },
        isStart: true,
        status: GameStatus.GAME,
      }));

      Swish.play(); // 비디오 휙 넘어가는 소리

      setTimeout(() => {
        Bell.play(); // 게임 시작 시 '땡땡땡' 복싱 벨 울리는 소리
      }, 1000);

      setTimeout(() => {
        GameMusic.play(); // 게임 배경음악
        GameMusic.volume = 0.3;
      }, 1500);
    });

    socket.on('get_count_down', (count: number, stage: string) => {
      console.log(count, stage);
      setGame((prev) => ({ ...prev, countDown: count }));

      if (count === 3) {
        CountDown3s.play();
      }

      if (count === 0) {
        CameraClick.play();

        //todo
        //todo
        //todo

        setTimeout(() => {
          if (stage === 'offend') {
            setGame((prev) => ({ ...prev, stage: GameStage.DEFEND }));
          } else if (stage === 'defend') {
            setGame((prev) => ({
              ...prev,
              stage: Number.isInteger(prev.round + 0.5) ? GameStage.ROUND : GameStage.OFFEND,
              round: prev.round + 0.5,
              user: { ...prev.user, isOffender: !prev.user.isOffender }, // 공수전환
            }));
          } else {
            console.log('카운트다운 오류', 'count:', count, 'stage:', stage);
          }
        }, 3000);
      }
    });

    socket.on('get_score', (score: number) => {
      setGame((prev) => ({ ...prev, peer: { ...prev.peer, score } }));
    });

    socket.on('get_change_stage', (stage: number) => {
      console.log('change stage to:', stage);
      setGame((prev) => ({ ...prev, stage }));
    });

    socket.on('get_change_status', (status: number) => {
      console.log('change status to:', status);
      setGame((prev) => ({ ...prev, status }));
    });

    // 게임이 끝났을 때
    socket.on('get_finish', () => {
      GameMusic.currentTime = 0;
      GameMusic.pause();
      console.log('get_finish');
      resetGame();
    });
    return () => {
      socket.removeAllListeners();
    };
  }, []);

  return null;
};

export default GameEventHandler;