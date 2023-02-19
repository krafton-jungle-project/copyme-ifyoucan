import RoomList from '../components/lobby/RoomList';
import logo from '../assets/images/logo.png'; //temp
import styled from 'styled-components';
import { atom, useAtom } from 'jotai';
import Loading from '../components/lobby/Loading';
import { stream, detector } from '../utils/tfjs-movenet';

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
          <RoomList />
        </div>
      )}
    </>
  );
}

export default Lobby;
