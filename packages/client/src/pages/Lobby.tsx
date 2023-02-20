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
import axios from 'axios';

export const isLoadedAtom = atom(false);

const Logo = styled.img`
  margin: auto;
  display: block;
  width: 200px;
  height: auto;
  text-align: center;
`;

//! for test
const nickNameArr = [
  '정태욱',
  '조제희',
  '박주환',
  '김태준',
  '홀란드',
  '덕배',
  '메시',
  '호날두',
  '소니',
];

const randomIdx = Math.floor(Math.random() * 10);
let nickName = nickNameArr[randomIdx];
function Lobby() {
  const [isLoaded, setIsLoaded] = useAtom(isLoadedAtom);
  const setNickName = useSetAtom(nickNameAtom);
  const navigate = useNavigate();

  const getUserInfo = async () => {
    if (document.cookie) {
      const token = document.cookie.split('=')[1];
      try {
        // const res = await axios.get('http://localhost:5001/users/', {
        const res = await axios.post('http://15.165.237.195:5001/users/', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res) {
          nickName = res.data.data.name;
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    getUserInfo();
    console.log(nickName);
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
