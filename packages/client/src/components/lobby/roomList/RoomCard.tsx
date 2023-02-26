import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Poro from '../../../assets/images/arcadePoro.png';
import { useSetAtom } from 'jotai';
import { roomInfoAtom } from '../../../app/room';

const RoomInfo = styled.div`
  margin-left: 10px;
  position: relative;
  width: 230px;
  height: 160px;
`;
const RoomName = styled.span`
  font-size: 23px;
  font-weight: 700;
`;

const PoroImg = styled.img`
  width: 140px;
  height: 140px;
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

interface Props {
  id: string;
  roomName: string;
  users: { id: string; nickName: string }[];
  isStart: boolean;
  readyCount: number;
}

export default function RoomCard({ roomInfo }: { roomInfo: Props }) {
  const navigate = useNavigate();
  const setRoomInfo = useSetAtom(roomInfoAtom);

  const joinRoom = (roomId: string) => {
    setRoomInfo((prev) => ({ ...prev, roomId }));
    navigate('/room');
  };

  return (
    <>
      <div>
        <PoroImg src={Poro} />
      </div>
      <RoomInfo>
        <RoomName>
          <RoomCnt>{roomInfo.users.length} / 2</RoomCnt>
          {roomInfo.roomName}
        </RoomName>
        <JoinBtn onClick={() => joinRoom(roomInfo.id)} disabled={roomInfo.users.length >= 2}>
          드루와
        </JoinBtn>
      </RoomInfo>
    </>
  );
}
