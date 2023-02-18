import { useAtom } from 'jotai';
import styled from 'styled-components';
import getPose from '../../utils/get-pose';
import { modeAtom, scoreAtom } from './InGame';

const Nickname = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  width: 400px;
  margin-bottom: 5px;
`;

const Name = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 195px;
  height: 50px;
  background-color: #88afe2;
  margin-right: 5px;
  border-radius: 10px;
  box-shadow: 2.5px 2.5px 2.5px rgba(0, 0, 0, 0.3);
`;

const Score = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 195px;
  height: 50px;
  background-color: #d579d8;
  margin-left: 5px;
  border-radius: 10px;
  box-shadow: 2.5px 2.5px 2.5px rgba(0, 0, 0, 0.3);
`;

function StateBox() {
  const [mode, setMode] = useAtom(modeAtom);
  const [score] = useAtom(scoreAtom);

  return (
    // 점수 닉네임 props로 받으십쇼
    <Nickname>
      <Name>
        <h2>닉네임</h2>
      </Name>
      <Score>{mode === 'wating' ? '준비해주세요' : score}</Score>
    </Nickname>
  );
}

export default StateBox;
