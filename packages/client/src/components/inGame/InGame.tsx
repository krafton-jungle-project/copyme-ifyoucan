import RoomHeader from './RoomHeader';
import WaitingBox from './waiting/WaitingBox';
import GameBox from './game/GameBox';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  height: 90%;
`;

const FadeBackGround = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 105%;
  height: 105%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 40px;
`;

function InGame() {
  return (
    <Container>
      <FadeBackGround />
      <RoomHeader />
      <WaitingBox />
      <GameBox />
    </Container>
  );
}

export default InGame;
