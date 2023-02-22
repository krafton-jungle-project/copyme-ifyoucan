import { useAtomValue } from 'jotai';
import styled from 'styled-components';
import { isStartAtom } from '../InGame';

const VS = styled.div<{ isStart: boolean }>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: ${(props) => (props.isStart ? '30%' : '50%')};
  left: ${(props) => (props.isStart ? '40%' : '50%')};
  width: ${(props) => (props.isStart ? '20%' : '0%')};
  height: ${(props) => (props.isStart ? '40%' : '0%')};
  font-size: 7vw;
  font-weight: 1000;

  border-radius: 2rem;
  padding: 0.4em;
  color: #fff;
  text-shadow: /* White glow */ 0 0 5px #fff, 0 0 20px #fff, 0 0 50px #fff,
    /* Green glow */ 0 0 42px #bc13fe, 0 0 120px #bc13fe, 0 0 92px #bc13fe, 0 0 102px #bc13fe,
    0 0 151px #bc13fe;

  transition-property: top, left, width, height;
  transition-delay: 1s;
  transition-duration: 0.5s, 0.5s, 0.5s, 0.5s;
`;

function Versus() {
  const isStart = useAtomValue(isStartAtom);

  return <VS isStart={isStart}>VS</VS>;
}

export default Versus;
