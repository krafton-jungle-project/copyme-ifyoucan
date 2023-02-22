import { useAtomValue } from 'jotai';
import styled from 'styled-components';
import VersusImg from '../../../assets/images/versus.png';
import { isStartAtom } from '../InGame';

const VS = styled.img<{ isStart: boolean }>`
  position: absolute;
  top: ${(props) => (props.isStart ? '30%' : '50%')};
  left: ${(props) => (props.isStart ? '40%' : '50%')};
  width: ${(props) => (props.isStart ? '20%' : '0%')};
  height: ${(props) => (props.isStart ? '40%' : '0%')};
  transition-property: top, left, width, height;
  transition-delay: 1s;
  transition-duration: 0.5s, 0.5s, 0.5s, 0.5s;
`;

function Versus() {
  const isStart = useAtomValue(isStartAtom);

  return <VS alt="VS" src={VersusImg} isStart={isStart} />;
}

export default Versus;
