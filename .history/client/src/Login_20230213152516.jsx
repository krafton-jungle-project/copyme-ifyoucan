import React, { useEffect, useState } from 'react';
import axios from 'axios';

const User = {
  id: 'test1234',
  pw: 'test2323',
};

export default function Login() {
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const [idValid, setIdValid] = useState(false);
  const [pwValid, setPwValid] = useState(false);
  const [notAllow, setNotAllow] = useState(true);

  useEffect(() => {
    if (idValid && pwValid) {
      setNotAllow(false);
      return;
    }
    setNotAllow(true);
  }, [idValid, pwValid]);

  const handleId = (e) => {
    setId(e.target.value);
    const regex = /^[a-z]+[a-z0-9]{5,19}$/g;
    if (regex.test(e.target.value)) {
      setIdValid(true);
    } else {
      setIdValid(false);
    }
  };
  const handlePw = (e) => {
    setPw(e.target.value);
    const regex = /^[a-z]+[a-z0-9]{5,19}$/g;
    if (regex.test(e.target.value)) {
      setPwValid(true);
    } else {
      setPwValid(false);
    }
  };
  const onClickConfirmButton = () => {
    console.log('login');
    axios({
      method: 'post',
      url: 'http://localhost:8000/users/login',
      data: {
        loginid: id,
        password: pw,
      },
    }).then((res) => {
      console.log(res);
    });

    if (id === User.id && pw === User.pw) {
      alert('로그인에 성공했습니다.');
    } else {
      alert('등록되지 않은 회원입니다.');
    }
  };
  return (
    <div className='page'>
      <div className='titleWrap'>COPY ME IF YOU CAN</div>

      <div className='contentWrap'>
        <div className='inputTitle'>아이디</div>
        <div className='inputWrap'>
          <input
            className='input'
            type='text'
            placeholder='test1234'
            value={id}
            onChange={handleId}
          />
        </div>
        <div className='errorMessageWrap'>
          {!idValid && id.length > 0 && (
            <div>올바른 아이디을 입력해주세요.</div>
          )}
        </div>

        <div style={{ marginTop: '26px' }} className='inputTitle'>
          비밀번호
        </div>
        <div className='inputWrap'>
          <input
            className='input'
            type='password'
            placeholder='영문, 숫자 포함'
            value={pw}
            onChange={handlePw}
          />
        </div>
        <div className='errorMessageWrap'>
          {!pwValid && pw.length > 0 && <div>영문, 숫자를 입력해주세요.</div>}
        </div>
      </div>
      <div>
        <button className='signupButton'>회원가입</button>
      </div>
      <div>
        <button
          onClick={onClickConfirmButton}
          disabled={notAllow}
          className='bottomButton'
        >
          로그인
        </button>
      </div>
    </div>
  );
}
