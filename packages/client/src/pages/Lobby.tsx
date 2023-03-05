import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { exitInGameAtom } from '../app/room';
import bgmOffImg from '../assets/images/lobby/bgm-off.png';
import bgmOnImg from '../assets/images/lobby/bgm-on.png';
import kraftonJungleImg from '../assets/images/lobby/krafton-jungle-logo.png';
import logoutImg from '../assets/images/lobby/logout.png';
import logoImg from '../assets/images/logo.png';
import BestShot from '../components/lobby/best-shot/BestShot';
import ItemGuide from '../components/lobby/item-guide/ItemGuide';
import Loading from '../components/lobby/Loading';
import RoomList from '../components/lobby/room-list/RoomList';
import Tutorial from '../components/lobby/tutorial/Tutorial';
import { useMovenetStream } from '../module/movenet-stream';
import { getUser, removeUser } from '../utils/local-storage';
import { BackgroundMusic, ButtonClick1, ButtonClick2 } from '../utils/sound';

const Container = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const Wrapper = styled.div`
  position: absolute;
  height: 80%;
  aspect-ratio: 3 / 2;
  min-width: 900px;
  min-height: 600px;
  max-width: 1050px;
  max-height: 700px;
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
  left: 5%;
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

export let myNickName = '';

function Lobby() {
  const navigate = useNavigate();
  const [mode, setMode] = useState('플레이');
  const { isStreamReady } = useMovenetStream();
  const [muteImg, setMuteImg] = useState(
    localStorage.getItem('bgm') === 'on' ? bgmOffImg : bgmOnImg,
  );
  const exitInGame = useAtomValue(exitInGameAtom);
  let content;
  switch (mode) {
    case '플레이':
      content = <RoomList />;
      break;
    case '튜토리얼':
      content = <Tutorial />;
      break;
    case '게임모드':
      content = <ItemGuide />;
      break;
    case '베스트샷':
      content = <BestShot />;
      break;
    default:
      content = <RoomList />;
      break;
  }

  useEffect(() => {
    // 닉네임 저장
    myNickName = getUser().nickName;

    // 게임 중 나오면 새로고침
    if (exitInGame) {
      window.location.reload();
    }

    // 배경음악 설정 상태에 따라 배경음악 재생
    if (localStorage.getItem('bgm') === 'on') {
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

  const logoutHandler = () => {
    ButtonClick1.play();
    const check = window.confirm('로그아웃 하시겠습니까?');
    if (check) {
      localStorage.setItem('isAuthenticated', 'false');
      removeUser();
      navigate('/login', { replace: true });
    } else {
      ButtonClick2.play();
    }
  };

  const bgmHandler = () => {
    if (localStorage.getItem('bgm') === 'on') {
      localStorage.setItem('bgm', 'off');
      ButtonClick1.play();
      BackgroundMusic.pause();
      setMuteImg(bgmOnImg);
    } else {
      localStorage.setItem('bgm', 'on');
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
                setMode('게임모드');
              }}
              isSelected={mode === '게임모드'}
            >
              게임모드
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
