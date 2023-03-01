import { useAtomValue } from 'jotai';
import styled from 'styled-components';
import { gameAtom } from '../../../app/game';
import { peerInfoAtom } from '../../../app/peer';
import { myNickName } from '../../../pages/Lobby';

const Container = styled.div<{ isStart: boolean }>`
  position: absolute;
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 40% 40% 20%;
  grid-auto-flow: rows;
  top: 50%;
  transform: translate(0, -50%);
  width: 14%;
  height: 80%;
  font-weight: 800;
  border: 1px solid #fff8;
  border-radius: 15px;
  padding: 6px;
  box-shadow: 0 0 2px #fff, 0 0 4px #fff;
  background-color: #000b;
  visibility: ${(props) => (props.isStart ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.isStart ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
  transition-delay: 3s;
`;

const Round = styled.p`
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 24px;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #f4ff00;
`;

const Point = styled.p`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 24px;
  color: #fffd;
`;

const NickName = styled.p<{ isMe: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  word-spacing: 20px;
  font-size: 15px;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${(props) => (props.isMe ? '#ff5959' : '#6083ff')};
`;

const Colon = styled.p`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  top: 40%;
  left: 50%;
  transform: translate(-50%);
  height: 40%;
  font-size: 30px;
  font-weight: 800;
`;

function RoundBox() {
  const game = useAtomValue(gameAtom);
  const peerNickName = useAtomValue(peerInfoAtom).nickName;

  return (
    <Container isStart={game.isStart}>
      <Round> {game.round < 4 ? `ROUND ${Math.floor(game.round)}` : 'GAME OVER'}</Round>
      <Point>{game.user.point}</Point>
      <Colon> : </Colon>
      <Point>{game.peer.point}</Point>
      <NickName isMe={true}>{myNickName}</NickName>
      <NickName isMe={false}>{peerNickName}</NickName>
    </Container>
  );
}

export default RoundBox;
