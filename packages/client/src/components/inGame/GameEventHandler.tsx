import { useEffect } from 'react';
import type * as poseDetection from '@tensorflow-models/pose-detection';
import { useAtom, useSetAtom } from 'jotai';
import { peerAtom } from '../../app/peer';
import { useClientSocket } from '../../module/client-socket';
import {
  countDownAtom,
  gameAtom,
  GameStage,
  GameStatus,
  messageAtom,
  myScoreAtom,
} from '../../app/game';
import { useNavigate } from 'react-router-dom';
import { Bell, CameraClick, CountDown3s, GameMusic, GunReload } from '../../utils/sound';
import { useResetAtom } from 'jotai/utils';

const GameSocket = () => {
  const setPeer = useSetAtom(peerAtom);
  const { socket } = useClientSocket();
  const [game, setGame] = useAtom(gameAtom);
  const resetGame = useResetAtom(gameAtom);
  const setMessage = useSetAtom(messageAtom);
  const navigate = useNavigate();
  const setCountDown = useSetAtom(countDownAtom);
  const setMyScore = useSetAtom(myScoreAtom);

  useEffect(() => {
    socket.on('get_ready', () => {
      GunReload.play();
      console.log('get_ready');
      setPeer((prev) => ({ ...prev, isReady: true }));
    });

    socket.on('get_unready', () => {
      GunReload.play();
      console.log('get_unready');
      setPeer((prev) => ({ ...prev, isReady: false }));
    });

    //! 공격자의 이미지와 포즈 정보를 받는다
    socket.on('get_image', (pose: poseDetection.Pose, imgSrc: string) => {
      // 공격자 이미지 저장
      setPeer((prev) => ({ ...prev, pose, imgSrc }));
    });

    //! 공격자의 이미지가 리셋된다
    socket.on('get_image_reset', () => {
      // 공격자 이미지 리셋
      console.log('get_image_reset');
      setPeer((prev) => ({ ...prev, pose: null, imgSrc: null }));
    });

    //! 게임 Status를 waiting에서 game으로 바꾼다
    socket.on('get_start', () => {
      console.log('get_start');

      setTimeout(() => {
        Bell.play();
      }, 800);

      setTimeout(() => {
        GameMusic.play();
      }, 1500);

      setGame((prev) => ({ ...prev, status: GameStatus.GAME }));
    });

    socket.on('get_count_down', (count: number, stage: string) => {
      console.log(count, stage);
      setCountDown(count);

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
              isOffender: !prev.isOffender, // 공수전환
              stage: Number.isInteger(prev.round + 0.5) ? GameStage.ROUND : GameStage.OFFEND,
              round: prev.round + 0.5,
            }));
          } else {
            console.log('카운트다운 오류', 'count:', count, 'stage:', stage);
          }
        }, 1000);
      }
    });

    socket.on('get_score', (score: number) => {
      setPeer((prev) => ({ ...prev, score }));
    });
  }, [setPeer, socket]);

  useEffect(() => {
    socket.on('get_change_stage', (stage: number) => {
      console.log('change stage to:', stage);
      setGame((prev) => ({ ...prev, stage }));
    });

    socket.on('get_change_status', (status: number) => {
      console.log('change status to:', status);
      setGame((prev) => ({ ...prev, status }));
    });

    socket.on('get_finish', () => {
      console.log('get_finish');
      resetGame();
      setMyScore(0);
      setPeer((prev) => ({ ...prev, score: 0 }));
    });

    socket.on('user_exit', () => {
      console.log('user_exit');
      if (game.status !== GameStatus.WAITING) {
        //todo
        navigate('/');
      }
    });
  }, []);

  return null;
};

export default GameSocket;
