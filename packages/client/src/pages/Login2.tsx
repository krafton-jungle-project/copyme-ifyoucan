import axios from 'axios';
import { useAtom } from 'jotai';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { isLoggedInAtom, isModalOpenedAtom } from '../app/login';
import RegisterModal from '../components/member/RegisterModal';
import jwt_decode from 'jwt-decode';
import { setCookie } from '../utils/cookies';
// import './Login.css';

const Wrapper = styled.div<{ isModalOpened: boolean }>`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid #f4a7f4;
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
  height: 350px;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const SubmitWrapper = styled.div`
  height: 200px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
`;

const TextDiv = styled.div<{ size: number; cursor?: boolean; isBtn?: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
  ${(props) =>
    props.size &&
    css`
      font-size: ${props.size}rem;
    `}
  ${(props) =>
    props.cursor &&
    css`
      cursor: pointer;
    `}
    ${(props) =>
    props.isBtn &&
    css`
      border: 2px solid #fff;
      border-radius: 3px;
      width: 85%;
      padding: 2% 0;

      position: absolute;
      bottom: 20%;

      &:hover {
        transition: 0.3s;
        box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #bc13fe, 0 0 0.8rem #bc13fe,
          0 0 2.8rem #bc13fe, inset 0 0 0.3rem #bc13fe;
        outline: none;
        border: none;
      }
    `}
`;

const Input = styled.input`
  font-size: large;
  color: #fff;
  border: 2px solid #fff;
  border-radius: 5px;
  padding: 4% 2%;
  width: 85%;
  background-color: transparent;

  &:focus {
    transition: 0.3s;
    box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 0.7rem #fff, 0 0 0.7rem #fff, 0 0 1rem #fff,
      inset 0 0 0.7rem #fff;
    outline: none;
  }
`;

const Btn = styled.button`
  width: 85%;
  padding: 2% 3%;
  border-radius: 3px;
  font-size: large;
  background-color: transparent;
  border: 2px solid #fff;
  color: #fff;
  cursor: pointer;

  &:hover {
    transition: 0.3s;
    box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #bc13fe, 0 0 0.8rem #bc13fe,
      0 0 2.8rem #bc13fe, inset 0 0 0.3rem #bc13fe;
    outline: none;
    border: none;
  }
`;

function Login2() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useAtom(isLoggedInAtom);

  const [isModalOpened, setIsModalOpened] = useAtom(isModalOpenedAtom);

  function openModal() {
    setIsModalOpened(true);
  }

  useEffect(() => {
    if (isLoggedIn) {
      navigate('/');
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
      // const res = await axios.post('http://15.165.237.195:5001/users/login', {
      const res = await axios.post('http://localhost:5001/users/login', {
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
      navigate('/'); // 성공시 이동될 url 적용하기

      return res;
    } catch (error) {
      alert('로그인에 실패했습니다.');
    }
  };

  return (
    <>
      {isModalOpened && <RegisterModal />}
      <Wrapper isModalOpened={isModalOpened}>
        <Form>
          <LoginWrapper>
            <TextDiv size={1.5}>로고 자리</TextDiv>
            <TextDiv size={1.5}>Sign in</TextDiv>
            <Input placeholder="아이디 입력" type="text" value={id} onChange={handleId} />
            <Input placeholder="비밀번호 입력" type="password" value={pw} onChange={handlePw} />
          </LoginWrapper>
          <SubmitWrapper>
            <TextDiv
              size={1.05}
              style={{
                position: 'absolute',
                bottom: '33%',
              }}
            >
              계정을 만들고 게임을 즐겨보세요!
            </TextDiv>
            <TextDiv size={1.2} cursor={true} onClick={openModal} isBtn={true}>
              계정 만들기
            </TextDiv>
            <Btn
              onClick={onClickConfirmButton}
              style={{
                position: 'absolute',
                bottom: '7%',
              }}
            >
              로그인
            </Btn>
          </SubmitWrapper>
        </Form>
      </Wrapper>
    </>
  );
}

export default Login2;
