import PuffLoader from 'react-spinners/PuffLoader';
import styled from 'styled-components';

const LoadingContainer = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const FadeBackGround = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: #333;
  opacity: 0.9;
`;

const LoadingWrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  height: 30%;
`;

const Loader = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const LoadingText = styled.p`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 400%;
  font-weight: 400;
  color: #fff;
  text-shadow: 0 0 5px #fff, 0 0 20px #fff, 0 0 50px #fff, 0 0 42px #bc13fe, 0 0 120px #bc13fe,
    0 0 92px #bc13fe, 0 0 102px #bc13fe, 0 0 151px #bc13fe;
`;

function Loading() {
  return (
    <LoadingContainer>
      <FadeBackGround />
      <LoadingWrapper>
        <Loader>
          <PuffLoader color="#a836d6" size={400} />
        </Loader>
        <LoadingText>Loading</LoadingText>
      </LoadingWrapper>
    </LoadingContainer>
  );
}

export default Loading;
