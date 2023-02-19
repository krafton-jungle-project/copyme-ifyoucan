import RoomList from '../components/lobby/RoomList';
import logo from '../assets/images/logo.png'; //temp
import styled from 'styled-components';
import { atom } from 'jotai';
import Loading from '../components/lobby/Loading';
import { useMovenetStream } from '../module/movenet-stream';

export const isLoadedAtom = atom(false);

const Logo = styled.img`
  margin: auto;
  display: block;
  width: 200px;
  height: auto;
  text-align: center;
`;

function Lobby() {
  const { isStreamReady } = useMovenetStream();

  return (
    <>
      {!isStreamReady ? (
        <Loading />
      ) : (
        <div>
          <Logo src={logo} />
          <hr />
          <RoomList />
        </div>
      )}
    </>
  );
}

export default Lobby;
