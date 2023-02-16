import { useEffect } from 'react';
import type { Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { ready, unready, getAttackerInfo, resetAttackerInfo } from '../../modules/user';
import type * as poseDetection from '@tensorflow-models/pose-detection';

const GameSocket = ({ socket }: { socket: Socket }) => {
  const dispatch = useDispatch();
  useEffect(() => {
    socket.on('get_ready', (socketId: string) => {
      console.log(`get_ready: ${socket.id}`);
      dispatch(ready(socketId));
    });

    socket.on('get_unready', (socketId: string) => {
      console.log(`get_unready: ${socket.id}`);
      dispatch(unready(socketId));
    });

    //! 공격자의 이미지와 포즈 정보를 받는다
    socket.on('get_image', (socketId: string, pose: poseDetection.Pose, imgSrc: string) => {
      // 공격자 이미지 저장
      dispatch(getAttackerInfo({ socketId, imgSrc, pose }));
    });

    //! 공격자의 이미지가 리셋된다
    socket.on('get_image_reset', (socketId: string) => {
      // 공격자 이미지 리셋
      dispatch(resetAttackerInfo(socketId));
    });

    //! 구현 필요
    socket.on('get_start', () => {});
    socket.on('get_attack', () => {});
  }, [dispatch, socket]);

  return null;
};

export default GameSocket;
