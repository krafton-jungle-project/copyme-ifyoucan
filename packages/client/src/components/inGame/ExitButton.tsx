import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BackgroundMusic } from '../../utils/sound';

const Container = styled.div`
  position: absolute;
  right: 0%;
  width: 10%;
  height: 100%;
`;

const Exit = styled.p`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(0, -50%);

  border-radius: 10px;
  padding: 2px 5px 0 5px;
  box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 1rem #a6ff33, 0 0 0.5rem #a6ff33,
    0 0 1rem #a6ff33, inset 0 0 0.5rem #a6ff33;
  font-size: 2.5vw;
  font-weight: 400;
  text-shadow: 0 0 5px #a6ff33, 0 0 10px #a6ff33;
  cursor: pointer;
`;

//todo: 디자인 컨셉에 맞는 EXIT ICON(Imgae) 추가
function ExitButton() {
  const navigate = useNavigate();

  const exitRoom = () => {
    BackgroundMusic.currentTime = 0;
    navigate('/', { replace: true });
  };

  return (
    <Container>
      <Exit onClick={exitRoom}>EXIT</Exit>
    </Container>
  );
}

export default ExitButton;
