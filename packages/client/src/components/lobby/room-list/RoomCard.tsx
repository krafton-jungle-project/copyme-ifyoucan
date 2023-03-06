import { useSetAtom } from 'jotai';
import type { IGameMode } from 'project-types';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { roomInfoAtom } from '../../../app/room';
import BlueImg from '../../../assets/images/lobby/room-card/blue.gif';
import GreenImg from '../../../assets/images/lobby/room-card/green.gif';
import OrangeImg from '../../../assets/images/lobby/room-card/orange.gif';
import PinkImg from '../../../assets/images/lobby/room-card/pink.gif';
import PurpleImg from '../../../assets/images/lobby/room-card/purple.gif';
import RedImg from '../../../assets/images/lobby/room-card/red.gif';
import YellowImg from '../../../assets/images/lobby/room-card/yellow.gif';

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
  font-size: 24px;
  font-weight: 700;
  padding-bottom: 5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;

  @media only screen and (max-height: 800px) {
    font-size: 20px;
  }
`;

const RoomGameMode = styled.div`
  font-size: 16px;

  @media only screen and (max-height: 800px) {
    font-size: 12px;
  }
`;

const HeadCount = styled.div<{ isFull: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 16px;
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
  thumbnailIdx: number;
}

function RoomCard({ roomInfo }: { roomInfo: RoomInfo }) {
  const navigate = useNavigate();
  const setRoomInfo = useSetAtom(roomInfoAtom);
  const mode = ['일반', '블러', '회전', '축소'];
  const ThumbnailImg = [RedImg, PinkImg, OrangeImg, YellowImg, GreenImg, BlueImg, PurpleImg];

  const joinRoom = (roomId: string, gameMode: IGameMode) => {
    if (!roomInfo.isStart && roomInfo.users.length === 1) {
      setRoomInfo((prev) => ({ ...prev, roomId, gameMode }));
      navigate('/room', { replace: true });
    }
  };

  return (
    <Container>
      <Thumbnail alt="room thumbnail" src={ThumbnailImg[roomInfo.thumbnailIdx]} />
      <Wrapper>
        <RoomName>{roomInfo.roomName}</RoomName>
        <RoomGameMode>
          {mode[roomInfo.gameMode.round1]} / {mode[roomInfo.gameMode.round2]} /{' '}
          {mode[roomInfo.gameMode.round3]}
        </RoomGameMode>
        <HeadCount isFull={roomInfo.isStart || roomInfo.users.length === 2}>
          {roomInfo.users.length} / 2
        </HeadCount>
        <JoinButton
          onClick={() => joinRoom(roomInfo.id, roomInfo.gameMode)}
          disabled={roomInfo.isStart || roomInfo.users.length === 2}
          isFull={roomInfo.users.length === 2}
        >
          {roomInfo.isStart ? 'inGame' : roomInfo.users.length === 2 ? 'FULL' : 'JOIN'}
        </JoinButton>
      </Wrapper>
    </Container>
  );
}

export default RoomCard;
