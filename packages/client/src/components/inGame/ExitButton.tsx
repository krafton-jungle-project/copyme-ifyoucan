import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  right: 0%;
  width: 15%;
  height: 100%;
  cursor: pointer; /* 마우스 올리면 손모양 커서 */
`;

//todo: 디자인 컨셉에 맞는 EXIT ICON(Imgae) 추가
function ExitButton() {
  const navigate = useNavigate();

  const exitRoom = () => {
    navigate('/', { replace: true });
  };

  return (
    <Container onClick={exitRoom}>
      <h2>EXIT</h2> {/* temp */}
    </Container>
  );
}

export default ExitButton;
