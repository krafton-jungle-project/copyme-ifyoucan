import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { setCookie } from '../utils/cookies';
import SignUpModal from '../components/member/SignUpModal';
import styled from 'styled-components';
import './Login.css';

const Page = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  max-width: 500px;
  padding: 0 20px;

  left: 50%;
  transform: translate(-50%, 0);

  background-color: green;

  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const TitleWrap = styled.div`
  margin-top: 87px;
  font-size: 26px;
  font-weight: bold;
  color: #262626;
`;

const ContentWrap = styled.div`
  margin-top: 26px;
  flex: 1;
`;

const InputTitle = styled.div`
  font-size: 12px;
  font-weight: 600;
  color: #262626;
`;

const InputWrap = styled.div`
  display: flex;
  border-radius: 8px;
  padding: 16px;
  margin-top: 8px;
  background-color: white;
  border: 1px solid #e2e0e0;
  :focus-within {
    border: 1px solid #9e30f4;
  }
`;

const ErrorMessageWrap = styled.div`
  margin-top: 8px;
  color: #ef0000;
  font-size: 12px;
`;

const SignupButton = styled.button`
  width: 100%;
  height: 48px;
  border: none;
  font-weight: bold;
  border-radius: 64px;
  background-color: #9e30f4;
  color: white;
  margin-bottom: 16px;
  cursor: pointer;
`;

const BottomButton = styled.button`
  width: 100%;
  height: 48px;
  border: none;
  font-weight: bold;
  border-radius: 64px;
  background-color: #9e30f4;
  color: white;
  margin-bottom: 16px;
  cursor: pointer;
  :disabled {
    background-color: #dadada;
    color: white;
  }
`;

const Input = styled.input`
  width: 100%;
  outline: none;
  border: none;
  height: 17px;
  font-size: 14px;
  font-weight: 400;
  ::placeholder {
    color: #dadada;
  }
`;

export default function Login() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const [idValid, setIdValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  const [notAllow, setNotAllow] = useState(true);
  const [signUpModalOn, setSignUpModalOn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (idValid && pwValid) {
      setNotAllow(false);
      return;
    }
    setNotAllow(true);
  }, [idValid, pwValid]);

  const handleId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
    const regex = /^[a-z]+[a-z0-9]{5,19}$/g;
    if (regex.test(e.target.value)) {
      setIdValid(true);
    } else {
      setIdValid(false);
    }
  };
  const handlePw = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPw(e.target.value);
    const regex = /^[a-z]+[a-z0-9]{5,19}$/g;
    if (regex.test(e.target.value)) {
      setPwValid(true);
    } else {
      setPwValid(false);
    }
  };
  const onClickConfirmButton = async () => {
    console.log('login');
    try {
      const res = await axios.post('http://15.165.237.195:5001/users/login', {
        // const res = await axios.post('http://localhost:3000/users/login', {
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
      navigate('/'); // 성공시 이동될 url 적용하기

      return res;
    } catch (error) {
      alert('로그인에 실패했습니다.');
    }
  };

  // const registerButton = () => {
  //   return <SignUpModal show={signUpModalOn} onHide={() => setSignUpModalOn(false)} />;
  //   // navigate('/signup');
  // };

  return (
    <>
      <SignUpModal show={signUpModalOn} onHide={() => setSignUpModalOn(false)} />
      <Page>
        <TitleWrap>COPY ME IF YOU CAN</TitleWrap>
        <ContentWrap>
          <InputTitle>아이디</InputTitle>
          <InputWrap>
            <Input type="text" placeholder="test1234" value={id} onChange={handleId} />
          </InputWrap>
          <ErrorMessageWrap>
            {!idValid && id.length > 0 && <div>올바른 아이디을 입력해주세요.</div>}
          </ErrorMessageWrap>

          <InputTitle style={{ marginTop: '26px' }}>비밀번호</InputTitle>
          <InputWrap>
            <form>
              <Input
                type="password"
                placeholder="영문, 숫자 포함"
                value={pw}
                onChange={handlePw}
                autoComplete="on"
              />
            </form>
          </InputWrap>
          <ErrorMessageWrap>
            {!pwValid && pw.length > 0 && <div>영문, 숫자를 입력해주세요.</div>}
          </ErrorMessageWrap>
        </ContentWrap>
        <div>
          <SignupButton onClick={() => setSignUpModalOn(true)}>회원가입</SignupButton>
        </div>
        <div>
          <BottomButton onClick={onClickConfirmButton} disabled={notAllow}>
            로그인
          </BottomButton>
        </div>
      </Page>
    </>
  );
}
