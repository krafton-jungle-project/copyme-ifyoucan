import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const NormalDiv = styled.div`
  border: 2px solid yellow;
  width: 22%;
  height: 95%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BlurDiv = styled.div`
  border: 2px solid yellow;
  width: 22%;
  height: 95%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SpinDiv = styled.div`
  border: 2px solid yellow;
  width: 22%;
  height: 95%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SizeDownDiv = styled.div`
  border: 2px solid yellow;
  width: 22%;
  height: 95%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function ItemGuide() {
  return (
    <Wrapper>
      <NormalDiv>일반</NormalDiv>
      <BlurDiv>블러</BlurDiv>
      <SpinDiv>회전</SpinDiv>
      <SizeDownDiv>축소</SizeDownDiv>
    </Wrapper>
  );
}

export default ItemGuide;
