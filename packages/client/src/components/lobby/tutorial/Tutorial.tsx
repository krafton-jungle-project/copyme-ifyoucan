import styled from 'styled-components';
import PoseCam from './PoseCam';

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
`;

const CameraWrapper = styled.div`
  border: 2px solid yellow;
  width: 45%;
  height: 95%;
`;

function Tutorial() {
  return (
    <Wrapper>
      <ImgWrapper>hello</ImgWrapper>
      <CameraWrapper>
        <PoseCam />
      </CameraWrapper>
    </Wrapper>
  );
}

export default Tutorial;
