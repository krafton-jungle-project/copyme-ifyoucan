import styled from 'styled-components';
import Guide from './tutorial/Guide';
import PoseCam from './tutorial/PoseCam';
import PoseImg from './tutorial/PoseImg';

const Container = styled.div`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 20% 80%;
  grid-auto-flow: rows;
  width: 80%;
  height: 90%;
`;

const ImgWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin: 20px 30px;
  border: 1px solid #ff00cc;
  background-color: #ff00cc11;
  border-radius: 5px;
`;

const CameraWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 30px;
`;

function Tutorial() {
  return (
    <Container>
      <Guide />
      <ImgWrapper>
        <PoseImg />
      </ImgWrapper>
      <CameraWrapper>
        <PoseCam />
      </CameraWrapper>
    </Container>
  );
}

export default Tutorial;
