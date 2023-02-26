import styled from 'styled-components';
import loadingImg from '../../assets/images/loading.gif';

const Container = styled.div`
  margin-top: 150px;
  width: auto;
  height: auto;
  text-align: center;
`;

function Loading() {
  return (
    <Container>
      <img alt="Loading" src={loadingImg} />
      <h1>로딩중입니다</h1>
      <h1>잠시만 기다려주세요</h1>
    </Container>
  );
}

export default Loading;
