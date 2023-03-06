import { useEffect } from 'react';
import styled from 'styled-components';
import { useRoomAtom } from '../../../app/room';
import { useClientSocket } from '../../../module/client-socket';
import CreateRoom from './CreateRoom';
import RoomCard from './RoomCard';

const Container = styled.div`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 90%;
`;

const Header = styled.div`
  position: absolute;
  width: 100%;
  height: 6%;
`;

const Txt = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  height: 100%;
  padding: 0 10px 0 10px;
  font-size: 18px;
  font-weight: 400;
  text-shadow: 0 0 1px #fff, 0 0 3px #fff;
`;

const RoomCardContainer = styled.div`
  position: absolute;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-auto-rows: calc(100% / 3);
  grid-auto-flow: rows;
  padding: 10px;
  overflow: scroll;
  bottom: 0;
  width: 100%;
  height: 93%;
  border: 1px solid #f0c;
  background-color: #f0c1;
  border-radius: 5px;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const RoomCardWrapper = styled.div`
  padding: 10px;
`;

const NoRoomAnnouncer = styled.div`
  grid-column: 1 / 3;
  grid-row: 2 / 3;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  line-height: 2;
  font-size: 24px;
  color: #fffb;
`;

function RoomList() {
  const { socket } = useClientSocket();
  const { roomList, updateRooms } = useRoomAtom();

  useEffect(() => {
    socket.emit('rooms');

    socket.on('get_rooms', (rooms) => {
      updateRooms(rooms);
    });
  }, []);

  useEffect(() => {
    if (roomList.length === 0) {
      // 추가
    }
  }, [roomList]);

  return (
    <Container>
      <Header>
        <Txt>방 목록</Txt>
        <CreateRoom />
      </Header>
      <RoomCardContainer>
        {roomList.length === 0 ? (
          <NoRoomAnnouncer>
            현재 대기 중인 방이 없습니다 🥺
            <br />
            방을 직접 만들어 보세요!
          </NoRoomAnnouncer>
        ) : (
          roomList.map((room) => (
            <RoomCardWrapper key={room.id}>
              <RoomCard roomInfo={room} />
            </RoomCardWrapper>
          ))
        )}
      </RoomCardContainer>
    </Container>
  );
}

export default RoomList;
