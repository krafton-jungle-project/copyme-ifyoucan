import { useAtomValue } from 'jotai';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { gameAtom } from '../../app/game';
import { BackgroundMusic } from '../../utils/sound';
import exitImg from '../../assets/images/exit.png';

const Container = styled.div`
  position: absolute;
  top: 50%;
  right: 2%;
  transform: translate(0, -50%);
  width: 5%;
  height: 50%;
  cursor: pointer;
`;

const ExitImg = styled.img`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%);
  height: 70%;
`;

const ExitTxt = styled.p`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  font-size: 12px;
  color: #baffba;
  text-shadow: 0 0 5px #15ff00;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

function ExitButton() {
  const navigate = useNavigate();
  const isStart = useAtomValue(gameAtom).isStart;

  const exitRoom = () => {
    if (isStart) {
      BackgroundMusic.currentTime = 0;
    }
    navigate('/', { replace: true });
  };

  return (
    <Container onClick={exitRoom}>
      <ExitImg alt="exit" src={exitImg} />
      <ExitTxt>EXIT</ExitTxt>
    </Container>
  );
}

export default ExitButton;
