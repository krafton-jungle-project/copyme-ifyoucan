import { useSetAtom } from 'jotai';
import type { IGameMode } from 'project-types';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { roomInfoAtom } from '../../../app/room';
import PoroImg from '../../../assets/images/arcade-poro.png';

const Container = styled.div`
  display: inline-flex;
  width: 100%;
  height: 100%;
  background-color: #0003;
  border: 1px solid #fffa;
  border-radius: 5px;
  padding: 10px;
`;

const Thumbnail = styled.img`
  height: 100%;
  aspect-ratio: 1;
  border-radius: 5px;
`;

const Wrapper = styled.div`
  position: relative;
  width: 0;
  flex: auto;
  margin-left: 10px;
`;

const RoomName = styled.div`
  display: block;
  font-size: 24px;
  font-weight: 700;
  padding-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const HeadCount = styled.div<{ isFull: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 20px;
  font-weight: 600;
  color: ${(props) => (props.isFull ? '#f16' : '#cf0')};
`;

const JoinButton = styled.button<{ isFull: boolean }>`
  position: absolute;
  width: 80px;
  bottom: 0;
  right: 0;
  border-radius: 5px;
  color: ${(props) => (props.isFull ? '#fff' : '#000')};
  background-color: ${(props) => (props.isFull ? '#f168' : '#cf0')};
  font-size: 16px;
  font-weight: 800;

  ${(props) =>
    !props.isFull &&
    css`
      &:hover {
        width: 90px;
        font-size: 18px;
        cursor: pointer;
      }
    `}
  transition: 0.15s;
`;

interface RoomInfo {
  id: string;
  roomName: string;
  users: { id: string; nickName: string }[];
  isStart: boolean;
  readyCount: number;
  gameMode: IGameMode;
}

const mode = ['일반', '블러', '회전', '축소'];

function RoomCard({ roomInfo }: { roomInfo: RoomInfo }) {
  const navigate = useNavigate();
  const setRoomInfo = useSetAtom(roomInfoAtom);

  const joinRoom = (roomId: string, gameMode: IGameMode) => {
    if (roomInfo.users.length === 1) {
      setRoomInfo((prev) => ({ ...prev, roomId, gameMode }));
      navigate('/room', { replace: true });
    }
  };

  return (
    <Container>
      <Thumbnail alt="room thumbnail" src={PoroImg} />
      <Wrapper>
        <RoomName>{roomInfo.roomName}</RoomName>
        <HeadCount isFull={roomInfo.users.length === 2}>{roomInfo.users.length} / 2</HeadCount>
        <JoinButton
          onClick={() => joinRoom(roomInfo.id, roomInfo.gameMode)}
          disabled={roomInfo.users.length === 2}
          isFull={roomInfo.users.length === 2}
        >
          {roomInfo.users.length === 2 ? 'FULL' : 'JOIN'}
        </JoinButton>
        <div>
          {mode[roomInfo.gameMode.round1]} / {mode[roomInfo.gameMode.round2]} /{' '}
          {mode[roomInfo.gameMode.round3]}
        </div>
      </Wrapper>
    </Container>
  );
}

export default RoomCard;
