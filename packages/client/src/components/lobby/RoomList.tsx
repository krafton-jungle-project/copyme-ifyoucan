import { useEffect } from 'react';
import styled from 'styled-components';
import CreateRoom from './room-list/CreateRoom';
import { useClientSocket } from '../../module/client-socket';
import RoomCard from './room-list/RoomCard';
import { useRoomAtom } from '../../app/room';

const Container = styled.div``;

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
  border: 1px solid #fffa;
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

export default function RoomList() {
  const { socket } = useClientSocket();
  const { roomsList, updateRooms } = useRoomAtom();

  useEffect(() => {
    socket.emit('rooms');
  }, [socket]);

  useEffect(() => {
    socket.on('get_rooms', (rooms) => {
      updateRooms(rooms);
    });
  }, [socket, updateRooms]);

  return (
    <Container>
      <CreateRoom />
      <RoomContainerWrapper>
        <RoomContainer>
          {roomsList.map((room) => {
            return (
              <RoomBox key={room.id}>
                <RoomCard roomInfo={room} />
              </RoomBox>
            );
          })}
        </RoomContainer>
      </RoomContainerWrapper>
    </Container>
  );
}
