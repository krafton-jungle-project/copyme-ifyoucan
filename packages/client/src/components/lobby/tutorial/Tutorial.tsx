import styled from 'styled-components';
import Announce from './Announce';
import PoseCam from './PoseCam';
import PoseImg from './PoseImg';

const Wrapper = styled.div`
  border: 2px solid yellow;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  height: 55rem;
`;

const ImgWrapper = styled.div`
  border: 2px solid yellow;
  width: 45%;
  height: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

const CameraWrapper = styled.div`
  border: 2px solid yellow;
  width: 45%;
  height: 95%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

function Tutorial() {
  return (
    <Wrapper>
      <ImgWrapper>
        <Announce />
        <PoseImg />
      </ImgWrapper>
      <CameraWrapper>
        <PoseCam />
      </CameraWrapper>
    </Wrapper>
  );
}

export default Tutorial;
