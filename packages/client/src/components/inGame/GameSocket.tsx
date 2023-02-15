import { useEffect } from 'react';
import type { Socket } from 'socket.io-client';
import { useDispatch } from 'react-redux';
import { ready, unready } from '../../modules/user';

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

    //! 구현 필요
    socket.on('get_start', () => {});
    socket.on('get_attack', () => {});
  }, [dispatch, socket]);

  return null;
};

export default GameSocket;
