import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function SignUp() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');
  const [name, setName] = useState('');
  const [idValid, setIdValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  const [notAllow, setNotAllow] = useState(true);
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

  const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const onClickConfirmButton = () => {
    console.log('signup');
    axios
      .post('http://localhost:5001/users', {
        loginid: id,
        name: name,
        password: pw,
      })
      .then((res) => {
        console.log('asd');
        console.log(res.data.data);
        // 토큰을 받아서 저장 (local storage 또는 쿠키?)
        navigate('/users/login');
        return res;
      })
      .catch((error) => {
        // 회원가입 실패시 알림
        console.log(error);
      });
  };

  return (
    <div className="page">
      <div className="titleWrap">회원가입</div>

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
        <div style={{ marginTop: '26px' }} className="inputTitle">
          닉네임
        </div>
        <div className="inputWrap">
          <input
            className="input"
            type="name"
            placeholder="닉네임"
            value={name}
            onChange={handleName}
          />
        </div>
      </div>

      <div>
        <button onClick={onClickConfirmButton} disabled={notAllow} className="CompleteButton">
          가입하기
        </button>
      </div>
    </div>
  );
}
