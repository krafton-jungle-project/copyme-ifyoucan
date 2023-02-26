import { useAtom, useSetAtom } from 'jotai';
import { useState } from 'react';
import styled, { css } from 'styled-components';
import { isModalOpenedAtom } from '../app/login';
import RegisterModal from '../components/member/RegisterModal';
// import './Login.css';

const Div = styled.div`
  border-radius: 10px;
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Wrapper = styled.div`
  /* position: absolute; */
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 2px solid #f4a7f4;
  border-radius: 12px;
  min-height: 500px;
  min-width: 448px;
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
  height: 150px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const TextWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 90%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 90%;
  height: 50px;
  padding: 25px 0px;
`;

const TextDiv = styled.div<{ size: number; cursor?: boolean }>`
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
`;

const Input = styled.input`
  border: 2px solid #f4a7f4;
  border-radius: 5px;
  padding: 4% 2%;
  width: 85%;
`;

const Btn = styled.button`
  padding: 2% 3%;
  border-radius: 3px;
`;

function Login2() {
  const [isModalOpened, setIsModalOpened] = useAtom(isModalOpenedAtom);

  function openModal() {
    setIsModalOpened(true);
    console.log('누름');
  }

  return (
    <Div>
      {isModalOpened && <RegisterModal />}
      <Wrapper>
        <LoginWrapper>
          <TextDiv size={1.5}>Copy me</TextDiv>
          <TextDiv size={1.5}>Sign in</TextDiv>
          <Input placeholder="아이디 입력" type="text" />
          <Input placeholder="비밀번호 입력" type="password" />
        </LoginWrapper>
        <SubmitWrapper>
          <TextWrapper>
            <TextDiv size={1.05}>계정을 만들고 게임을 즐겨보세요!</TextDiv>
          </TextWrapper>
          <ButtonWrapper>
            <TextDiv size={1} cursor={true} onClick={openModal}>
              Create account
            </TextDiv>
            <Btn>Submit</Btn>
          </ButtonWrapper>
        </SubmitWrapper>
      </Wrapper>
    </Div>
  );
}

export default Login2;
