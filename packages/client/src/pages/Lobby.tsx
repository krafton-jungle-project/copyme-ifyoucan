import RoomList from '../components/lobby/RoomList';
import logo from '../assets/images/logo.png'; //temp
import styled from 'styled-components';
import { atom, useAtom, useSetAtom } from 'jotai';
import Loading from '../components/lobby/Loading';
import { stream, detector } from '../utils/tfjs-movenet';
import { nickNameAtom } from '../app/atom';
import { useEffect } from 'react';
import { getUser } from '../utils/local-storage';
import { removeUser } from '../utils/localstorage';
import { useNavigate } from 'react-router-dom';

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
  // const [isAuthenticated, setIsAuthenticated] = useState<string | null>(
  //   sessionStorage.getItem('isAuthenticated'),
  // );
  const navigate = useNavigate();
  // const userInfo = getUser();

  useEffect(() => {
    setNickName(nickName);
  }, []);
  if (isLoaded && (!stream || !detector)) {
    setIsLoaded(false);
    console.log('error: stream & detector is reloaded.');
  }

  const logoutHandler = () => {
    alert('로그아웃 하시겠습니까?');
    removeUser();
    navigate('/login');
  };

  return (
    <>
      {!isLoaded ? (
        <Loading />
      ) : (
        <div>
          <Logo src={logo} />
          <button
            onClick={() => {
              sessionStorage.setItem('isAuthenticated', 'false');
              logoutHandler();
            }}
          >
            로그아웃
          </button>
          <hr />
          <RoomList />
        </div>
      )}
    </>
  );
}

export default Lobby;
