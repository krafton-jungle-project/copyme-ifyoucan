import styled from 'styled-components';

const Div = styled.div`
  position: absolute;
  height: 130px;
  width: 470px;
  background-color: aquamarine;
  top: 340px;
  left: 464px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 28px;
  font-weight: 800;
  border-radius: 20px;
  box-shadow: 3.3px 3.3px 3.3px rgba(0, 0, 0, 0.3);
`;

function AnnounceWrapper() {
  return <Div>관리실에서 안내 말씀 드립니다.</Div>;
}

export default AnnounceWrapper;
