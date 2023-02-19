import RoomList from '../components/lobby/RoomList';
import logo from '../assets/images/logo.png'; //temp
import styled from 'styled-components';
import { io } from 'socket.io-client';
import { useEffect } from 'react';
import { atom, useAtom } from 'jotai';
import Loading from '../components/lobby/Loading';
import { stream, detector } from '../utils/tfjs-movenet';

// const SOCKET_SERVER_URL = 'http://localhost:8081';
const SOCKET_SERVER_URL = 'http://15.165.237.195:8081';

export const isLoadedAtom = atom(false);

const Logo = styled.img`
  margin: auto;
  display: block;
  width: 200px;
  height: auto;
  text-align: center;
`;

function Lobby() {
  const [isLoaded, setIsLoaded] = useAtom(isLoadedAtom);
  const socket = io(SOCKET_SERVER_URL);

  useEffect(() => {
    return () => {
      socket.disconnect();
      console.log('lobby socket disconnected.');
    };
  }, [socket]);

  if (isLoaded && (!stream || !detector)) {
    setIsLoaded(false);
    console.log('error: stream & detector is reloaded.');
  }

  return (
    <>
      {!isLoaded ? (
        <Loading />
      ) : (
        <div>
          <Logo src={logo} />
          <hr />
          <RoomList socket={socket} />
        </div>
      )}
    </>
  );
}

export default Lobby;
