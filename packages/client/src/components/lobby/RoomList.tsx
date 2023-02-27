import { useEffect } from 'react';
import styled from 'styled-components';
import { useRoomAtom } from '../../app/room';
import { useClientSocket } from '../../module/client-socket';
import CreateRoom from './room-list/CreateRoom';
import RoomCard from './room-list/RoomCard';

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
  border: 1px solid #ff00cc;
  background-color: #ff00cc11;
  border-radius: 5px;
`;

const RoomCardWrapper = styled.div`
  padding: 10px;
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

  return (
    <Container>
      <Header>
        <Txt>방 목록</Txt>
        <CreateRoom />
      </Header>
      <RoomCardContainer>
        {roomList.map((room) => {
          return (
            <RoomCardWrapper>
              <RoomCard key={room.id} roomInfo={room} />
            </RoomCardWrapper>
          );
        })}
      </RoomCardContainer>
    </Container>
  );
}

export default RoomList;
