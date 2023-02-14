import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import styled from 'styled-components';
import Poro from '../assets/arcadePoro.png';
import CreateRoom from './CreateRoom';

// const SOCKET_SERVER_URL = 'http://localhost:8081';
const SOCKET_SERVER_URL = 'http://15.165.237.195:8081';

const RoomContainer = styled.div`
  width: 950px;
  height: 530px;
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  border: 1px solid red;
  padding: 30px 50px;
  flex-wrap: wrap;
  overflow: scroll;
`;

const RoomBox = styled.div`
  width: 370px;
  height: 150px;
  margin: 5px 5px;
  border: 1px solid black;
  border-radius: 7px;
  padding: 30px 20px;
  display: flex;
`;

const RoomHeader = styled.h2`
  text-align: center;
  margin-top: 20px;
`;

const RoomName = styled.span`
  font-size: 23px;
  font-weight: 700;
`;

const PoroImg = styled.img`
  width: 140px;
  height: 140px;
`;

const RoomInfo = styled.div`
  margin-left: 10px;
  position: relative;
  width: 230px;
  height: 160px;
`;

const JoinBtn = styled.button`
  position: absolute;
  width: 80px;
  height: 50px;
  font-size: 23px;
  bottom: 0;
  right: 0;
`;

const RoomCnt = styled.span`
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 23px;
  font-weight: 600;
`;

export default function RoomList() {
  const navigate = useNavigate();
  const nickName = 'user1'; //temp

  const socket = io(SOCKET_SERVER_URL); //check 렌더링 될 때마다 기존 연결을 끊지 않고 소켓을 새로 만든다.

  // 페이지를 나갈 때 소켓 연결을 끊는다.
  //check 어디서 return 하며 disconnect 해야할까? 위 생성 과정과 연계하여 추후 고민 필요
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    socket.on('connect', () => console.log('lobby: socket connection complete.'));
    socket.on('error', () => console.log('lobby: socket connection error occur.'));
  }, []);

  const [rooms, setRooms] = useState<{
    [key: string]: {
      roomName: string;
      users: { id: string; nickName: string }[];
      started: boolean;
      readyCount: number;
    };
  }>({});

  // 사이트에서 나가는 시도(새로고침, 브라우저 닫기)를 할 때 경고창 띄우기
  const preventClose = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = ''; // chrome에서는 return value 설정 필요
  };

  useEffect(() => {
    (() => window.addEventListener('beforeunload', preventClose))();
    return () => window.removeEventListener('beforeunload', preventClose);
  }, []);

  useEffect(() => {
    socket.emit('rooms');
  }, []);

  useEffect(() => {
    socket.on('get_rooms', (rooms) => setRooms(rooms));
  }, [rooms]);

  const joinRoom = (roomId: string) => {
    navigate('/room', {
      state: {
        roomId: roomId,
        nickName: nickName,
      },
    });
  };

  //! 방 하나 하나를 component화 필요
  return (
    <div className="play">
      <CreateRoom nickName={nickName} socket={socket}></CreateRoom>
      <RoomHeader>방 목록</RoomHeader>
      <RoomContainer>
        {Object.entries(rooms).map((room) => {
          return (
            <RoomBox key={room[0]}>
              <div>
                <PoroImg src={Poro} />
              </div>
              <RoomInfo>
                <RoomName>
                  <RoomCnt>{room[1].users.length} / 4</RoomCnt>
                  {room[1].roomName}
                </RoomName>
                <JoinBtn onClick={() => joinRoom(room[0])} disabled={room[1].users.length >= 4}>
                  드루와
                </JoinBtn>
              </RoomInfo>
            </RoomBox>
          );
        })}
      </RoomContainer>
    </div>
  );
}