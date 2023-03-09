import { useEffect, useState } from 'react';
import styled from 'styled-components';
import * as movenet from '../utils/tfjs-movenet';
import Chart from './Chart';
import GraphCam from './GraphCam';

const Div = styled.div`
  /* border: 1px solid yellowgreen; */
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const GraphWrapper = styled.div`
  /* border: 1px solid blue; */
  height: auto;
  width: 45%;
`;

const CamWrapper = styled.div`
  /* border: 1px solid red; */
  display: block;
  width: 100%;
  height: 100%;
`;

const ChartWrapper = styled.div`
  width: 55%;
`;

const Score = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: plum;
  color: black;
  font-size: larger;
  height: 100px;
  width: 100px;
`;

const Btn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid red;
  height: 30px;
  width: 30px;
`;

function Graph() {
  const [start, setStart] = useState(false);

  useEffect(() => {
    if (!start) {
      cancelAnimationFrame(movenet.myRafId);
    }
  }, [start]);

  return (
    <>
      <Div>
        <GraphWrapper>
          <CamWrapper>{start && <GraphCam />}</CamWrapper>
        </GraphWrapper>
        <ChartWrapper>
          <Chart start={start}></Chart>
        </ChartWrapper>
      </Div>
      <Btn onClick={() => setStart((p) => !p)}>시작</Btn>
    </>
  );
}

export default Graph;
