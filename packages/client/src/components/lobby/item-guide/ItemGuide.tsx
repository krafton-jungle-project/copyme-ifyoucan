import { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import jjang9 from '../../../assets/images/gameMode/jjang9.png';
import jjang9spin from '../../../assets/images/gameMode/jjang9spin.png';
import jjanggu from '../../../assets/images/gameMode/jjanggu.png';

const blur = keyframes`
  from {
    filter: blur(0);
  }
  to {
    filter: blur(17px);
  }
`;

const spin = keyframes`
  0% {
    transform: scaleX(-1);
  }
  50% {
    transform: scaleX(1);
  }
  100% {
    transform: scaleX(-1);
  }
`;

const sizeDown = keyframes`
  from {
    transform: scale(1.0);
  }
  to {
    transform: scale(0.4);
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
`;

const GameModeDiv = styled.div`
  border: 2px solid yellow;
  width: 88%;
  height: 20%;
  display: flex;
  align-items: center;
`;

const ModeNameDiv = styled.div<{ keys: number; concen: number }>`
  display: block;
  text-align: center;
  width: 25%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;

  ${(p) =>
    p.keys === p.concen &&
    css`
      font-size: 1.7rem;
      text-shadow: 0 0 2px #fff, 0 0 1px #fff, 0 0 10px #fff, 0 0 20px #bc13fe, 0 0 30px #bc13fe,
        0 0 20px #bc13fe, 0 0 30px #bc13fe, 0 0 50px #bc13fe;
    `}
`;

const ModeWrapper = styled.div`
  border: 2px solid green;
  width: 88%;
  height: 60%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Div = styled.div`
  border: 2px solid yellow;
  width: 25%;
  height: 95%;
  display: flex;
  align-items: center;
  justify-content: center;
  object-fit: cover;

  &:hover {
    background-color: white;
    width: 30%;
    height: 114%;
  }
`;

const Img = styled.img<{ mode: string }>`
  width: 100%;
  height: 100%;
  max-width: 280px;
  max-height: 280px;

  ${(p) =>
    p.mode === 'blur' &&
    css`
      &:hover {
        animation-delay: 2s;
        animation: ${blur} 1.5s infinite;
      }
    `}
  ${(p) =>
    p.mode === 'spin' &&
    css`
      &:hover {
        animation-delay: 1s;
        animation: ${spin} 0.7s infinite;
      }
    `}
  ${(p) =>
    p.mode === 'sizedown' &&
    css`
      &:hover {
        animation-delay: 3s;
        animation: ${sizeDown} 0.7s infinite;
      }
    `}
`;

const mode = ['normal', 'blur', 'spin', 'sizedown'];
const modeName = ['일반', '블러', '회전', '축소'];

function ItemGuide() {
  const [concen, setConcen] = useState<number>(-1);

  function initConcen() {
    setConcen(-1);
  }

  return (
    <>
      <Wrapper>
        <GameModeDiv>
          {modeName.map((val, key) => {
            return (
              <ModeNameDiv key={key} keys={key} concen={concen}>
                {val}
              </ModeNameDiv>
            );
          })}
        </GameModeDiv>
        <ModeWrapper>
          <Div onMouseEnter={() => setConcen(0)} onMouseLeave={initConcen}>
            일반
          </Div>
          <Div onMouseEnter={() => setConcen(1)} onMouseLeave={initConcen}>
            <Img src={jjanggu} mode={mode[1]} />
          </Div>
          <Div onMouseEnter={() => setConcen(2)} onMouseLeave={initConcen}>
            <Img src={jjang9spin} mode={mode[2]} />
          </Div>
          <Div onMouseEnter={() => setConcen(3)} onMouseLeave={initConcen}>
            <Img src={jjang9} mode={mode[3]} />
          </Div>
        </ModeWrapper>
      </Wrapper>
    </>
  );
}

export default ItemGuide;
