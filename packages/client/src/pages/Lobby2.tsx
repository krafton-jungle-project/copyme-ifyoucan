import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import logoImg from '../assets/images/logo.png';
import Loading from '../components/lobby/Loading';
import { Button } from '../utils/sound';
import logoutImg from '../assets/images/logout.png';
import kraftonJungleImg from '../assets/images/krafton-jungle-logo.png';

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
  box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #bc13fe, 0 0 0.8rem #bc13fe,
    0 0 2.8rem #bc13fe, inset 0 0 1.3rem #bc13fe;
`;

const Header = styled.div`
  position: absolute;
  top: 0;
  width: 100%;
  height: 20%;
`;

const Logo = styled.img`
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translate(-50%);
  height: 50%;
`;

const LogOutWrapper = styled.div`
  position: absolute;
  top: 10%;
  right: 2%;
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
  bottom: 0%;
  left: 50%;
  transform: translate(-50%);
  font-size: 12px;
  color: #baffba;
  text-shadow: 0 0 5px #15ff00;
  margin: 0;
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

  ${(props) =>
    props.isSelected &&
    css`
      color: white;
      text-shadow: 0 0 2px #fff, 0 0 1px #fff, 0 0 10px #fff, 0 0 20px #bc13fe, 0 0 30px #bc13fe,
        0 0 20px #bc13fe, 0 0 30px #bc13fe, 0 0 50px #bc13fe;
    `}

  cursor: pointer;
  transition: 0.2s;
`;

const VerticalLine = styled.div`
  height: 30px;
  border: 1px solid rgba(255, 255, 255, 0.5);
`;

const Section = styled.div`
  position: absolute;
  top: 20%;
  width: 100%;
  height: 70%;
  /* border: 1px solid yellow; */
`;

const Article = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  height: 100%;
  border: 1px solid white;
`;

const Footer = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  bottom: 0;
  width: 100%;
  height: 10%;
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
`;

function Lobby2() {
  const [mode, setMode] = useState('Play');

  return (
    <Container>
      {/* <Loading /> */}
      <Wrapper>
        <Header>
          <Logo alt="logo" src={logoImg} />
          <LogOutWrapper>
            <LogOutImg alt="logout" src={logoutImg} />
            <LogOutTxt>LOGOUT</LogOutTxt>
          </LogOutWrapper>
          <NavBar>
            <NavItem
              onClick={() => {
                Button.play();
                setMode('Play');
              }}
              isSelected={mode === 'Play'}
            >
              플레이
            </NavItem>
            <VerticalLine />
            <NavItem
              onClick={() => {
                Button.play();
                setMode('Tutorial');
              }}
              isSelected={mode === 'Tutorial'}
            >
              튜토리얼
            </NavItem>
            <VerticalLine />
            <NavItem
              onClick={() => {
                Button.play();
                setMode('BestShot');
              }}
              isSelected={mode === 'BestShot'}
            >
              베스트샷
            </NavItem>
          </NavBar>
        </Header>
        <Section>
          <Article></Article>
        </Section>
        <Footer>
          <a href="https://jungle.krafton.com/">
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

export default Lobby2;
