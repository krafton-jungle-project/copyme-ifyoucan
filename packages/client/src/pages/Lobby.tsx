import RoomList from '../components/lobby/RoomList';
import logo from '../assets/images/logo.png'; //temp
import styled from 'styled-components';
import { atom, useAtom, useSetAtom } from 'jotai';
import Loading from '../components/lobby/Loading';
import { stream, detector } from '../utils/tfjs-movenet';
import { nickNameAtom } from '../app/atom';
import { useEffect } from 'react';

export const isLoadedAtom = atom(false);

const Logo = styled.img`
  margin: auto;
  display: block;
  width: 200px;
  height: auto;
  text-align: center;
`;
const nickName = '정태욱';

function Lobby() {
  const [isLoaded, setIsLoaded] = useAtom(isLoadedAtom);
  //temp
  const setNickName = useSetAtom(nickNameAtom);
  useEffect(() => {
    setNickName(nickName);
  }, []);
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
