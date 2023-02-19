import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import { setCookie } from '../utils/cookies';
import SignUpModal from '../components/member/SignUpModal';

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
      // const res =await axios.post('http://15.165.237.195:5001/users/login'
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
      navigate('/'); // 성공시 이동될 url 적용하기

      return res;
    } catch (error) {
      alert('로그인에 실패했습니다.');
    }
  };

  // const registerButton = () => {
  //   console.log('asaa');
  //   return <SignUpModal show={signUpModalOn} onHide={() => setSignUpModalOn(false)} />;
  //   // navigate('/signup');
  // };

  return (
    <>
      <SignUpModal show={signUpModalOn} onHide={() => setSignUpModalOn(false)} />
      <div className="page">
        <div className="titleWrap">COPY ME IF YOU CAN</div>

        <div className="contentWrap">
          <div className="inputTitle">아이디</div>
          <div className="inputWrap">
            <input
              className="input"
              type="text"
              placeholder="test1234"
              value={id}
              onChange={handleId}
            />
          </div>
          <div className="errorMessageWrap">
            {!idValid && id.length > 0 && <div>올바른 아이디을 입력해주세요.</div>}
          </div>

          <div style={{ marginTop: '26px' }} className="inputTitle">
            비밀번호
          </div>
          <div className="inputWrap">
            <input
              className="input"
              type="password"
              placeholder="영문, 숫자 포함"
              value={pw}
              onChange={handlePw}
            />
          </div>
          <div className="errorMessageWrap">
            {!pwValid && pw.length > 0 && <div>영문, 숫자를 입력해주세요.</div>}
          </div>
        </div>
        <div>
          <button onClick={() => setSignUpModalOn(true)} className="signupButton">
            회원가입
          </button>
        </div>
        <div>
          <button onClick={onClickConfirmButton} disabled={notAllow} className="bottomButton">
            로그인
          </button>
        </div>
      </div>
    </>
  );
}
