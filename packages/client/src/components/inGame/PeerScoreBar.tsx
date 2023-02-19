import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  background-color: blue;
  box-sizing: border-box;
  border: 5px solid blue;
  top: 20%;
  right: 5%;
  width: 4%;
  aspect-ratio: 16/105;
`;

const ScoreBar = styled.div<{ score: number }>`
  position: absolute;
  background-color: gray;
  width: 100%;
  height: ${(props) => `${(100 - props.score).toString()}%`};
  transition-property: height;
  transition-duration: 0.5s;
`;

function PeerScoreBar() {
  return (
    <Container>
      <ScoreBar score={50} />
    </Container>
  );
}

export default PeerScoreBar;
