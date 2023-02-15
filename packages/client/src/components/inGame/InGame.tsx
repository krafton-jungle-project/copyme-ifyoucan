import type { Socket } from 'socket.io-client';
import PeerVideo from './PeerVideo';
import styled from 'styled-components';
import MyVideo from './MyVideo';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import ConnectWebRTC from '../lobby/ConnectWebRTC';
import type { WebRTCProps } from '../lobby/ConnectWebRTC';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeUser } from '../../modules/user';
import ReadyButton from '../inGame/waiting/ReadyButton';
import GameSocket from './GameSocket';

const UserLabel = styled.h2`
  color: blue;
`;

//todo socket, roomId, nickName 등 전역 관리 필요
function InGame({ socket, roomId, nickName }: WebRTCProps) {
  const dispatch = useDispatch();
  const otherUsers = useSelector((state: RootState) => state.users);

  ConnectWebRTC({ socket, roomId, nickName });

  useEffect(() => {
    return () => {
      // 방에서 나갈 시 otherUser 정보 초기화
      dispatch(initializeUser());
    };
  }, []);

  return (
    <div>
      <MyVideo />
      <UserLabel>{nickName}</UserLabel>
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

export default InGame;
