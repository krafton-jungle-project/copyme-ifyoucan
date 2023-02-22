import styled from 'styled-components';

const Container = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  left: 0%;
  width: 15%;
  height: 100%;
`;

function Logo() {
  return (
    <Container>
      <h2>LOGO</h2> {/* temp */}
    </Container>
  );
}

export default Logo;
