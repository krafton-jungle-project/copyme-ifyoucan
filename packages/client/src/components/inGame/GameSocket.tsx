import { useEffect } from 'react';
import type { Socket } from 'socket.io-client';
import type * as poseDetection from '@tensorflow-models/pose-detection';
import { useSetAtom } from 'jotai';
import { modeAtom } from './InGame';
import { peerAtom } from '../../app/peer';
import { useClientSocket } from '../../module/client-socket';
const GameSocket = () => {
  const setMode = useSetAtom(modeAtom);
  const setPeer = useSetAtom(peerAtom);

  const { socket } = useClientSocket();

  useEffect(() => {
    socket.on('get_ready', () => {
      console.log('get_ready');
      setPeer((prev) => ({ ...prev, isReady: true }));
    });

    socket.on('get_unready', () => {
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

    //! 구현 필요
    socket.on('get_start', () => {
      console.log('get_start');
      setMode('game');
    });

    socket.on('get_attack', () => {});
  }, [setMode, setPeer, socket]);

  return null;
};

export default GameSocket;
