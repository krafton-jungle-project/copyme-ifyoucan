import { useEffect, useState } from 'react';
import styled from 'styled-components';
import getPose from '../../utils/get-pose';
import { comparePoses } from '../../utils/pose-similarity';

const Container = styled.div`
  position: absolute;
  background-color: red;
  box-sizing: border-box;
  border: 5px solid red;
  top: 20%;
  left: 5%;
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

function MyScoreBar() {
  const [score, setScore] = useState(0);

  // useEffect(() => {
  //   async function getScore() {
  //     const myPose = await getPose();
  //     setScore(comparePoses(myPose, myPose));
  //   }
  //   setInterval(getScore, 1000);
  // }, []);

  return (
    <Container>
      <ScoreBar score={score} />
    </Container>
  );
}

export default MyScoreBar;
