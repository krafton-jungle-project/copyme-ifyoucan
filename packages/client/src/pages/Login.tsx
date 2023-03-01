import axios from 'axios';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { isLoggedInAtom, isModalOpenedAtom } from '../app/login';
import RegisterModal from '../components/member/RegisterModal';
import jwt_decode from 'jwt-decode';
import { setCookie } from '../utils/cookies';
import { useMovenetStream } from '../module/movenet-stream';
import Loading from '../components/lobby/Loading';
import logoImg from '../assets/images/logo.png';
import { ButtonClick } from '../utils/sound';

const Container = styled.div<{ isModalOpened: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  border: 0.1rem solid #fff;
  border-radius: 12px;
  box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #bc13fe, 0 0 0.8rem #bc13fe,
    0 0 2.8rem #bc13fe, inset 0 0 1.3rem #bc13fe;
  min-height: 550px;
  min-width: 448px;
  ${(props) =>
    props.isModalOpened &&
    css`
      z-index: -1;
      box-shadow: none;
    `}
`;

const Form = styled.form`
  width: 100%;
`;

const LoginWrapper = styled.div`
  position: absolute;
  height: 350px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const SubmitWrapper = styled.div`
  position: absolute;
  top: 350px;
  height: 200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

const Logo = styled.img`
  position: absolute;
  top: 10%;
  height: 100px;
`;

const TextDiv = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  font-size: 1.05rem;
  text-shadow: 0 0 2px #fff;
`;

const Input = styled.input<{ nameTag: string }>`
  position: absolute;
  top: ${(props) => (props.nameTag === 'id' ? '45%' : '70%')};
  font-size: large;
  color: #fff;
  border: 2px solid #fff;
  border-radius: 5px;
  padding: 4% 2%;
  width: 80%;
  background-color: transparent;

  &:focus {
    transition: 0.3s;
    box-shadow: 0 0 0.1rem #fff, 0 0 0.1rem #fff, 0 0 0.4rem #fff, 0 0 0.4rem #fff, 0 0 0.6rem #fff,
      inset 0 0 0.4rem #fff;
    outline: none;
  }
`;

const Btn = styled.div<{ nameTag: string }>`
  position: absolute;
  bottom: ${(props) => (props.nameTag === 'register' ? '25%' : '60%')};
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80%;
  height: 20%;
  padding: 2% 3%;
  border-radius: 3px;
  font-size: large;
  font-weight: 600;
  background-color: ${(props) => (props.nameTag === 'register' ? '#e6a7ff54' : '#e6a7ff54')};
  border: 2px solid #fff;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #e6a7ff44;
    text-shadow: 0 0 2px #fff;
    box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #bc13fe, 0 0 0.8rem #bc13fe,
      0 0 2.8rem #bc13fe, inset 0 0 0.3rem #bc13fe;
  }
`;

function Login() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);
  const [isModalOpened, setIsModalOpened] = useAtom(isModalOpenedAtom);
  const { isStreamReady } = useMovenetStream();

  function openModal() {
    setIsModalOpened(true);
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/', { replace: true });
    }
  }, [isLoggedIn, navigate]);

  function handleId(e: React.ChangeEvent<HTMLInputElement>) {
    setId(e.target.value);
  }

  function handlePw(e: React.ChangeEvent<HTMLInputElement>) {
    setPw(e.target.value);
  }

  const onClickConfirmButton = async (e: any) => {
    e.preventDefault();
    ButtonClick.play();
    console.log('login');
    if (id === '') {
      alert(`아이디를 입력해주세요`);
      return;
    }
    if (pw === '') {
      alert(`비밀번호를 입력해주세요`);
      return;
    }
    try {
      const res = await axios.post('http://15.165.237.195:5001/users/login', {
        // const res = await axios.post('http://localhost:5001/users/login', {
        loginid: id,
        password: pw,
      });
      const jwtToken = res.data.data.token;
      setCookie('accessJwtToken', jwtToken);
      const decodedUserInfo = jwt_decode(jwtToken); // 토큰 decode
      localStorage.setItem('userInfo', JSON.stringify(decodedUserInfo)); //토큰에 저장되어있는 userInfo 저장
      //로그인 해야지만 다음 이동 가능하게
      sessionStorage.setItem('isAuthenticated', 'true');
      // 메인으로 이동
      setIsLoggedIn(true);
      navigate('/', { replace: true }); // 성공시 이동될 url 적용하기

      return res;
    } catch (error) {
      alert('로그인에 실패했습니다.');
    }
  };

  return (
    <>
      {isModalOpened && <RegisterModal />}
      {!isStreamReady ? <Loading /> : null}
      <Container isModalOpened={isModalOpened}>
        <Form>
          <LoginWrapper>
            <Logo alt="logo" src={logoImg} />
            <Input
              placeholder="아이디 입력"
              type="text"
              value={id}
              onChange={handleId}
              nameTag="id"
            />
            <Input
              placeholder="비밀번호 입력"
              type="password"
              value={pw}
              onChange={handlePw}
              nameTag="pw"
            />
          </LoginWrapper>
          <SubmitWrapper>
            <TextDiv>계정을 만들고 게임을 즐겨보세요!</TextDiv>
            <Btn onClick={onClickConfirmButton} nameTag="login">
              로그인
            </Btn>
            <Btn onClick={openModal} nameTag="register">
              계정 만들기
            </Btn>
          </SubmitWrapper>
        </Form>
      </Container>
    </>
  );
}

export default Login;
