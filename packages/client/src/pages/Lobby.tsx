import RoomList from '../components/lobby/room-list/RoomList';
import styled, { css } from 'styled-components';
import Loading from '../components/lobby/Loading';
import { useEffect, useState } from 'react';
import { removeUser } from '../utils/local-storage';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Tutorial from '../components/lobby/tutorial/Tutorial';
import { useMovenetStream } from '../module/movenet-stream';
import { BackgroundMusic } from '../utils/sound';
import logoImg from '../assets/images/logo.png';
import { ButtonClick1, ButtonClick2 } from '../utils/sound';
import logoutImg from '../assets/images/logout.png';
import kraftonJungleImg from '../assets/images/krafton-jungle-logo.png';
import BestShot from '../components/lobby/best-shot/BestShot';
import bgmOnImg from '../assets/images/bgm-on.png';
import bgmOffImg from '../assets/images/bgm-off.png';
import ItemGuide from '../components/lobby/item-guide/ItemGuide';

const Container = styled.div`
  /* position: absolute;
  width: 100%;
  height: 100%; */
`;

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
  box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 1rem #bc13fe, 0 0 0.4rem #bc13fe,
    0 0 1.4rem #bc13fe, inset 0 0 0.6rem #bc13fe;
`;

const Header = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 20%;
`;

const MuteWrapper = styled.div`
  position: absolute;
  top: 20%;
  left: 5%;
  width: 6%;
  height: 40%;
  cursor: pointer;
`;

const MuteImg = styled.img`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%);
  height: 70%;
`;

const MuteTxt = styled.p`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  font-size: 12px;
  color: #fceab5;
  text-shadow: 0 0 5px #ff9300;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Logo = styled.img`
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%);
  height: 50%;
  cursor: pointer;
`;

const LogOutWrapper = styled.div`
  position: absolute;
  top: 20%;
  right: 5%;
  width: 6%;
  height: 40%;
  cursor: pointer;
`;

const LogOutImg = styled.img`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%);
  height: 70%;
`;

const LogOutTxt = styled.p`
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%);
  font-size: 12px;
  color: #baffba;
  text-shadow: 0 0 5px #15ff00;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const NavBar = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 5%;
  left: 50%;
  height: auto;
  transform: translate(-50%);
  width: 80%;
  height: 30%;
  padding: 10px;
`;

const NavItem = styled.div<{ isSelected: boolean }>`
  width: 15%;
  font-size: 25px;
  text-align: center;
  padding: 5px 5px 5px 5px;
  margin: 0 10px 0 10px;
  color: #fff8;
  transition: 0.5s;

  ${(props) =>
    props.isSelected &&
    css`
      color: white;
      text-shadow: 0 0 2px #fff, 0 0 1px #fff, 0 0 10px #fff, 0 0 20px #bc13fe, 0 0 30px #bc13fe,
        0 0 20px #bc13fe, 0 0 30px #bc13fe, 0 0 50px #bc13fe;
    `}

  ${(props) =>
    !props.isSelected &&
    css`
      &:hover {
        text-shadow: 0 0 1px #fff, 0 0 3px #fff;
      }
    `}
  cursor: pointer;
`;

const VerticalLine = styled.div`
  height: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
`;

const Section = styled.div`
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%);
  width: 90%;
  height: 70%;
  border: 2px solid #fff8;
  border-radius: 5px;
`;

const Footer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  width: 100%;
  height: 10%;
  z-index: -1;
`;

const ProducedBy = styled.div`
  font-size: 12px;
  text-align: center;
  margin: 0 2px 0 2px;
  color: #fff8;
`;

const Producer = styled.div`
  font-size: 15px;
  text-align: center;
  color: #fff8;
  text-shadow: 0 0 2px #fff8;
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

const randomIdx = Math.floor(Math.random() * 10);
export let myNickName = nickNameArr[randomIdx]; //temp

export let prevBgmState = true;

function Lobby() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('플레이');
  const { isStreamReady } = useMovenetStream();
  const [muteImg, setMuteImg] = useState(prevBgmState === true ? bgmOffImg : bgmOnImg);
  let content;

  switch (mode) {
    case '플레이':
      content = <RoomList />;
      break;
    case '튜토리얼':
      content = <Tutorial />;
      break;
    case '아이템 안내':
      content = <ItemGuide />;
      break;
    case '베스트샷':
      content = <BestShot />;
      break;
    default:
      content = <RoomList />;
      break;
  }

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
    ButtonClick1.play();
    const check = window.confirm('로그아웃 하시겠습니까?');
    if (check) {
      sessionStorage.setItem('isAuthenticated', 'false');
      removeUser();
      navigate('/login', { replace: true }); //temp: Private Router 적용 후 삭제
    } else {
      ButtonClick2.play();
    }
  };

  useEffect(() => {
    if (prevBgmState === true) {
      setTimeout(() => {
        BackgroundMusic.play();
        BackgroundMusic.volume = 0.5;
      }, 1000);

      BackgroundMusic.addEventListener(
        'ended',
        function () {
          this.play();
        },
        false,
      );
    }
  }, []);

  const bgmHandler = () => {
    if (prevBgmState === true) {
      prevBgmState = false;
      ButtonClick1.play();
      BackgroundMusic.pause();
      setMuteImg(bgmOnImg);
    } else {
      prevBgmState = true;
      ButtonClick1.play();
      BackgroundMusic.play();
      setMuteImg(bgmOffImg);
    }
  };

  return (
    <Container>
      {!isStreamReady ? <Loading /> : null}
      <Wrapper>
        <Header>
          <MuteWrapper>
            <MuteImg src={muteImg} onClick={bgmHandler} />
            <MuteTxt>{muteImg === bgmOffImg ? 'BGM OFF' : 'BGM ON'}</MuteTxt>
          </MuteWrapper>
          <Logo
            alt="logo"
            src={logoImg}
            onClick={() => {
              window.location.reload();
            }}
          />
          <LogOutWrapper onClick={logoutHandler}>
            <LogOutImg alt="logout" src={logoutImg} />
            <LogOutTxt>LOGOUT</LogOutTxt>
          </LogOutWrapper>
          <NavBar>
            <NavItem
              onClick={() => {
                ButtonClick1.play();
                setMode('플레이');
              }}
              isSelected={mode === '플레이'}
            >
              플레이
            </NavItem>
            <VerticalLine />
            <NavItem
              onClick={() => {
                ButtonClick1.play();
                setMode('튜토리얼');
              }}
              isSelected={mode === '튜토리얼'}
            >
              튜토리얼
            </NavItem>
            <VerticalLine />
            <NavItem
              onClick={() => {
                ButtonClick1.play();
                setMode('아이템 안내');
              }}
              isSelected={mode === '아이템 안내'}
            >
              아이템 안내
            </NavItem>
            <VerticalLine />
            <NavItem
              onClick={() => {
                ButtonClick1.play();
                setMode('베스트샷');
              }}
              isSelected={mode === '베스트샷'}
            >
              베스트샷
            </NavItem>
          </NavBar>
        </Header>
        <Section>{content}</Section>
        <Footer>
          <a href="https://jungle.krafton.com/" target="_blank" rel="noreferrer">
            <img
              alt="krafton jungle logo"
              src={kraftonJungleImg}
              style={{ height: '30px', margin: '20px' }}
            />
          </a>
          <div>
            <ProducedBy>Produced By</ProducedBy>
            <Producer>김태준　|　박주환　|　정태욱　|　조제희</Producer>
          </div>
        </Footer>
      </Wrapper>
    </Container>
  );
}

export default Lobby;
