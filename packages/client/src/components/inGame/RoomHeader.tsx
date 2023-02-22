import styled from 'styled-components';
import Announcer from './Announcer';
import ExitButton from './ExitButton';
import Logo from './Logo';

const Container = styled.div`
  position: absolute;
  width: 100%;
  height: 15%;
`;

function RoomHeader() {
  return (
    <Container>
      <Logo />
      <Announcer />
      <ExitButton />
    </Container>
  );
}

export default RoomHeader;
