import styled from 'styled-components';

const Btn = styled.button`
  position: absolute;
  bottom: 0;
  border-style: none;
  left: 654px;
  font-size: 20px;
  font-weight: 700;
  color: blue;
`;

function ExitRoom() {
  return <Btn>나가기</Btn>;
}

export default ExitRoom;
