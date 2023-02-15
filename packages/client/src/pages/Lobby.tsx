import RoomList from '../components/lobby/RoomList';
import logo from '../assets/images/logo.png'; //temp
import styled from 'styled-components';
import { io } from 'socket.io-client';
import { useEffect } from 'react';

// const SOCKET_SERVER_URL = 'http://localhost:8081';
const SOCKET_SERVER_URL = 'http://15.165.237.195:8081';

const Logo = styled.img`
  margin: auto;
  display: block;
  width: 200px;
  height: auto;
  text-align: center;
`;

function Lobby() {
  const socket = io(SOCKET_SERVER_URL);
  useEffect(() => {
    return () => {
      socket.disconnect();
    };
  }, []);

  console.log('lobby 소켓 연결');

  return (
    <div>
      <Logo src={logo} />
      <hr />
      <RoomList socket={socket} />
    </div>
  );
}

export default Lobby;
