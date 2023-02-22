import { useAtomValue } from 'jotai';
import styled, { css } from 'styled-components';
import { isStartAtom } from '../InGame';

const VS = styled.div<{ isStart: boolean }>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;

  ${(props) =>
    props.isStart &&
    css`
      top: 30%;
      left: 40%;
      width: 20%;
      height: 40%;
      font-size: 7vw;
      font-weight: 1000;
    `}

  ${(props) =>
    !props.isStart &&
    css`
      top: 50%;
      left: 50%;
      width: 0%;
      height: 0%;
      font-size: 0;
      font-weight: 0;
    `}
    
  color: #fff;
  text-shadow: /* White glow */ 0 0 5px #fff, 0 0 20px #fff, 0 0 50px #fff,
    /* Green glow */ 0 0 42px #bc13fe, 0 0 120px #bc13fe, 0 0 92px #bc13fe, 0 0 102px #bc13fe,
    0 0 151px #bc13fe;

  transition: 0.5s;
  transition-delay: 1s;
`;

function Versus() {
  const isStart = useAtomValue(isStartAtom);

  return <VS isStart={isStart}>VS</VS>;
}

export default Versus;
