import { useAtomValue } from 'jotai';
import styled from 'styled-components';
import { gameAtom } from '../../../app/game';

const Container = styled.div<{ isStart: boolean }>`
  position: absolute;
  display: grid;
  grid-template-columns: 50% 0% 50%;
  grid-template-rows: calc(100% / 3) calc(100% / 3) calc(100% / 3);
  grid-auto-flow: rows;
  top: 50%;
  left: 0;
  transform: translate(0, -50%);
  width: 14%;
  height: 80%;
  font-size: 24px;
  font-weight: 800;
  border: 1px solid #fff8;
  border-radius: 15px;
  padding: 6px;
  box-shadow: 0 0 2px #fff, 0 0 4px #fff;
  background-color: #000b;
  visibility: ${(props) => (props.isStart ? 'visible' : 'hidden')};
  opacity: ${(props) => (props.isStart ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
  transition-delay: 1s;

  @media only screen and (max-height: 800px) {
    font-size: 18px;
  }
  @media only screen and (min-height: 1200px) {
    font-size: 30px;
  }
`;

const Round = styled.p`
  grid-column: 1 / 4;
  grid-row: 1 / 2;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #f4ff00;
`;

const Item = styled.p<{ isMe?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  color: ${(props) => (props.isMe === undefined ? '#fffd' : props.isMe ? '#ff5959' : '#6083ff')};
`;

function RoundBox() {
  const game = useAtomValue(gameAtom);

  return (
    <Container isStart={game.isStart}>
      <Round> {game.round < 4 ? `ROUND ${Math.floor(game.round)}` : 'GAME OVER'}</Round>
      <Item>{game.user.point}</Item>
      <Item>:</Item>
      <Item>{game.peer.point}</Item>
      <Item isMe={true}>나</Item>
      <Item />
      <Item isMe={false}>상대</Item>
    </Container>
  );
}

export default RoundBox;
