import type { Socket } from 'socket.io-client';
import PeerVideo from './PeerVideo';
import styled from 'styled-components';
import MyVideo from './MyVideo';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import WebRTC from './WebRTC';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { initializeUser } from '../../modules/user';
import ReadyButton from '../inGame/waiting/ReadyButton';
import GameSocket from './GameSocket';

const UserLabel = styled.h2`
  color: blue;
`;

interface IProps {
  socket: Socket;
  roomId: string;
  nickName: string;
}

//todo socket, roomId, nickName 등 전역 관리 필요
function Game({ socket, roomId, nickName }: IProps) {
  const dispatch = useDispatch();
  const otherUsers = useSelector((state: RootState) => state.users);

  useEffect(() => {
    return () => {
      dispatch(initializeUser());
    };
  }, []);

  return (
    <div>
      <MyVideo />
      <UserLabel>{nickName}</UserLabel>
      <WebRTC socket={socket} nickName={nickName} roomId={roomId} />
      <GameSocket socket={socket} />
      {otherUsers.map((user, index) => (
        <PeerVideo
          key={index}
          nickName={user.nickName}
          stream={user.stream}
          host={user.host}
          isReady={user.isReady}
        />
      ))}
      <ReadyButton socket={socket} roomId={roomId} />
    </div>
  );
}

export default Game;
