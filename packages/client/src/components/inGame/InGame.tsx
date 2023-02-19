import type { Socket } from 'socket.io-client';
import PeerVideo from './PeerVideo';
import styled, { css } from 'styled-components';
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
import StateBox from './StateBox';
import AnnounceWrapper from './AnnounceWrapper';
import ReadyBtn from './ReadyBtn';
import ExitRoom from './ExitRoom';

const position = [
  ['left', 'top'],
  ['right', 'top'],
  ['left', 'bottom'],
  ['right', 'bottom'],
];

const UserLabel = styled.h2`
  color: blue;
`;

const VideoWrapper = styled.div`
  position: relative;
  border: 3px solid transparent;
  width: 95%;
  height: 800px;
`;

const UserWrapper = styled.div<{ ps: number }>`
  border: 3px solid black;
  border-radius: 10px;
  padding: 5px;
  padding-top: 10px;
  width: 430px;
  height: 370px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  ${(props) =>
    props.ps &&
    css`
      ${position[props.ps][0]}: ${0};
      ${position[props.ps][1]}: ${0};
    `}
`;

interface IProps {
  socket: Socket;
  roomId: string;
  nickName: string;
}

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
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <VideoWrapper>
        <UserWrapper ps={0}>
          <MyVideo />
          {/* <UserLabel>{nickName}</UserLabel> */}
          <StateBox></StateBox>
        </UserWrapper>
        {/* <WebRTC socket={socket} nickName={nickName} roomId={roomId} /> */}
        <GameSocket socket={socket} />
        {otherUsers.map((user, index) => (
          <UserWrapper ps={index + 1}>
            <PeerVideo key={index} user={user} />
            <StateBox></StateBox>
          </UserWrapper>
        ))}
        {/* <ReadyButton socket={socket} roomId={roomId} /> */}
        <AnnounceWrapper></AnnounceWrapper>
        <ReadyBtn></ReadyBtn>
        <ExitRoom></ExitRoom>
      </VideoWrapper>
    </div>
  );
}

export default InGame;
