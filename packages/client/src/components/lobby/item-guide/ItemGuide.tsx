import { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import jjang9 from '../../../assets/images/gameMode/jjang9.png';
import jjang9spin from '../../../assets/images/gameMode/jjang9spin.png';
import jjanggu from '../../../assets/images/gameMode/jjanggu.png';
import { Pyororong, SizeDown, Spin } from '../../../utils/sound';

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

const ModeNameDiv = styled.div<{ keys: number; highlighted: number }>`
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
    p.keys === p.highlighted &&
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

const Img = styled.img`
  width: 100%;
  height: 100%;
  max-width: 280px;
  max-height: 280px;
`;

const Div = styled.div<{ mode: string }>`
  border: 2px solid yellow;
  width: 25%;
  height: 95%;
  display: flex;
  align-items: center;
  justify-content: center;
  object-fit: cover;

  &:hover {
    background-color: white;
    transition: 0.3s;
    transform: scale(1.2);
  }

  &:hover {
    & ${Img} {
      ${(p) =>
        p.mode === 'blur' &&
        css`
          animation: ${blur} 1s;
          animation-fill-mode: forwards;
        `}
      ${(p) =>
        p.mode === 'spin' &&
        css`
          animation: ${spin} 1s infinite;
        `}
  ${(p) =>
        p.mode === 'sizedown' &&
        css`
          animation: ${sizeDown} 1s;
          animation-fill-mode: forwards;
        `}
      animation-delay: 0.3s;
    }
  }
`;

const mode = ['normal', 'blur', 'spin', 'sizedown'];
const modeName = ['일반', '블러', '회전', '축소'];
const sound = [Spin, Pyororong, Spin, SizeDown];

function ItemGuide() {
  const [highlighted, setHighlighted] = useState<number>(-1);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();

  function initConcen() {
    setHighlighted(-1);
    if (intervalId) clearInterval(intervalId);
  }

  function playSound(idx: number) {
    setTimeout(() => {
      if (idx === 0) {
      } else if (idx === 1) {
        sound[idx].play();
      } else if (idx === 2) {
        sound[idx].play();
        setIntervalId(setInterval(() => sound[idx].play(), 1000));
      } else if (idx === 3) {
        sound[idx].play();
      }
    }, 300);
  }

  return (
    <>
      <Wrapper>
        <GameModeDiv>
          {modeName.map((val, key) => {
            return (
              <ModeNameDiv key={key} keys={key} highlighted={highlighted}>
                {val}
              </ModeNameDiv>
            );
          })}
        </GameModeDiv>
        <ModeWrapper>
          <Div
            onMouseEnter={() => {
              setHighlighted(0);
              playSound(0);
            }}
            onMouseLeave={initConcen}
            mode={mode[0]}
          >
            일반
          </Div>
          <Div
            onMouseEnter={() => {
              setHighlighted(1);
              playSound(1);
            }}
            onMouseLeave={initConcen}
            mode={mode[1]}
          >
            <Img src={jjanggu} />
          </Div>
          <Div
            onMouseEnter={() => {
              setHighlighted(2);
              playSound(2);
            }}
            onMouseLeave={initConcen}
            mode={mode[2]}
          >
            <Img src={jjang9spin} />
          </Div>
          <Div
            onMouseEnter={() => {
              setHighlighted(3);
              playSound(3);
            }}
            onMouseLeave={initConcen}
            mode={mode[3]}
          >
            <Img src={jjang9} />
          </Div>
        </ModeWrapper>
      </Wrapper>
    </>
  );
}

export default ItemGuide;
