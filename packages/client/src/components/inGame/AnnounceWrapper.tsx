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

function AnnounceWrapper({ message }: { message: string | JSX.Element }) {
  return <Div>{message}</Div>;
}

export default AnnounceWrapper;
