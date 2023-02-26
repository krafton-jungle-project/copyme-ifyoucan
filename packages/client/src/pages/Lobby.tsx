import RoomList from '../components/lobby/RoomList';
import styled, { css } from 'styled-components';
import Loading from '../components/lobby/Loading';
import { useEffect, useState } from 'react';
import { removeUser } from '../utils/localstorage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Tutorial from '../components/lobby/tutorial/Tutorial';
import { useMovenetStream } from '../module/movenet-stream';
import { BackgroundMusic } from '../utils/sound';

const Container = styled.div``;

const Wrapper = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 90%;
  background-color: rgba(0, 0, 0, 0.5);
  border: 0.1rem solid #fff;
  border-radius: 40px;

  box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #bc13fe, 0 0 0.8rem #bc13fe,
    0 0 2.8rem #bc13fe, inset 0 0 1.3rem #bc13fe;
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
  const navigate = useNavigate();
  const [mode, setMode] = useState('Room');
  const { isStreamReady } = useMovenetStream();

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

  useEffect(() => {
    setTimeout(() => {
      BackgroundMusic.currentTime = 0;
      BackgroundMusic.play();
    }, 2000);
    BackgroundMusic.addEventListener(
      'ended',
      function () {
        this.currentTime = 0;
        this.play();
      },
      false,
    );
  }, [isStreamReady]);

  return (
    <Container>
      {!isStreamReady ? <Loading /> : null}
      <Wrapper>
        <NavBar>
          <NavBtn onClick={onRoom}>Room</NavBtn>
          <NavBtn onClick={onTutorial}>Tutorial</NavBtn>
        </NavBar>
        <button
          onClick={() => {
            sessionStorage.setItem('isAuthenticated', 'false');
            logoutHandler();
          }}
        >
          로그아웃
        </button>
        {content}
      </Wrapper>
    </Container>
  );
}

export default Lobby;
