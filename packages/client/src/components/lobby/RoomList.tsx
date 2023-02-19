import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import CreateRoom from '../lobby/roomList/CreateRoom';
import { useClientSocket } from '../../module/client-socket';
import RoomCard from './roomList/RoomCard';

const RoomContainerWrapper = styled.div`
  display: flex;
  justify-content: center;
`;

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

export default function RoomList() {
  const navigate = useNavigate();
  const { socket } = useClientSocket();

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

  // ! 이 부분도 공통스테이트로 빼면 좋을 것 같습니다 - @minhoyooDEV
  useEffect(() => {
    socket.emit('rooms');
  }, []);

  useEffect(() => {
    socket.on('get_rooms', (rooms) => {
      // console.log(rooms);
      setRooms(rooms);
    });
  }, [rooms]);

  //! 방 하나 하나를 component화 필요
  return (
    <div className="play">
      <CreateRoom></CreateRoom>
      <RoomHeader>방 목록</RoomHeader>
      <RoomContainerWrapper>
        <RoomContainer>
          {Object.entries(rooms).map((room) => {
            return (
              <RoomBox key={room[0]}>
                <RoomCard roomId={room[0]} roomInfo={room[1]} />
              </RoomBox>
            );
          })}
        </RoomContainer>
      </RoomContainerWrapper>
    </div>
  );
}
