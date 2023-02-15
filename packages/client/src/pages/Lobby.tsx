import RoomList from '../components/lobby/RoomList';
import logo from '../assets/images/logo.png'; //temp
import MyVideo from '../components/inGame/MyVideo';
import styled from 'styled-components';

const Logo = styled.img`
  margin: auto;
  display: block;
  width: 200px;
  height: auto;
  text-align: center;
`;

function Lobby() {
  return (
    <div>
      <Logo src={logo} />
      <hr />
      <RoomList />
    </div>
  );
}

export default Lobby;
