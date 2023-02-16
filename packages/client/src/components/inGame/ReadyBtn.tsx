import styled from 'styled-components';

const Btn = styled.button`
  font-size: 20px;
  font-weight: 800;
  background-color: #d5e6f4;
  border-radius: 20px;
  position: absolute;
  bottom: 40px;
  left: 600px;
  width: 170px;
  height: 50px;
  border-style: none;
  box-shadow: 2.5px 2.5px 2.5px rgba(0, 0, 0, 0.3);
`;

function ReadyBtn() {
  return <Btn>준비 or 시작</Btn>;
}

export default ReadyBtn;
