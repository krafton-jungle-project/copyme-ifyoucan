import RoomList from '../components/lobby/RoomList';
import logo from '../assets/images/logo.png';
import styled from 'styled-components';
import { atom, useAtom } from 'jotai';
import Loading from '../components/lobby/Loading';
import { stream, detector } from '../utils/tfjs-movenet';
import { useEffect, useState } from 'react';
import { removeUser } from '../utils/localstorage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Tutorial from '../components/lobby/tutorial/Tutorial';

export const isLoadedAtom = atom(false);

const Logo = styled.img`
  margin: auto;
  display: block;
  width: 200px;
  height: auto;
  text-align: center;
`;

//temp
//! for test
const nickNameArr = [
  '정태욱',
  '조제희',
  '박주환',
  '김태준',
  '홀란드',
  '덕배',
  '메시',
  '즐라탄',
  '소니',
  '모드리치',
];

const NavBar = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const NavBtn = styled.button`
  width: 100px;
  height: 80px;
`;

const randomIdx = Math.floor(Math.random() * 10);
export let myNickName = nickNameArr[randomIdx]; //temp

function Lobby() {
  const [isLoaded, setIsLoaded] = useAtom(isLoadedAtom);
  const [mode, setMode] = useState('Room');
  const navigate = useNavigate();

  //todo: 최초 한 번만 실행하는 방법 생각해보기
  useEffect(() => {
    //todo: 경기 사진이나 동영상 가져올 때 정보 가져와야하므로 다시 고려해야함
    const setMyNickName = async () => {
      if (document.cookie) {
        const token = document.cookie.split('=')[1];
        try {
          const res = await axios.get('http://localhost:5001/users/', {
            // const res = await axios.get('http://15.165.237.195:5001/users/', {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res) {
            myNickName = res.data.data.name;
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    setMyNickName();
  }, []);

  if (isLoaded && (!stream || !detector)) {
    setIsLoaded(false);
    console.log('error: stream & detector is reloaded.');
  }

  const logoutHandler = () => {
    const check = window.confirm('로그아웃 하시겠습니까?');
    if (check) {
      removeUser();
      navigate('/login');
    }
  };

  let content = <RoomList />;

  const onRoom = () => {
    setMode('Room');
  };
  const onTutorial = () => {
    setMode('Tutorial');
  };

  switch (mode) {
    case 'Room':
      content = <RoomList />;
      break;
    case 'Tutorial':
      content = <Tutorial />;
      break;
    // case 'MyPage':
    //   content = <MyPage />
    //   break;
    default:
      break;
  }

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

          <NavBar>
            <NavBtn onClick={onRoom}>Room</NavBtn>
            <NavBtn onClick={onTutorial}>Tutorial</NavBtn>
          </NavBar>

          <hr />
          {content}
        </div>
      )}
    </>
  );
}

export default Lobby;
