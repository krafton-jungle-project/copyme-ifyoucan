import { useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import img1 from '../../../assets/images/gameMode/jjanggu-1.png';
import img2 from '../../../assets/images/gameMode/jjanggu-2.png';
import img3 from '../../../assets/images/gameMode/jjanggu-3.png';
import img4 from '../../../assets/images/gameMode/jjanggu-4.png';
import { Blur, ButtonClick4, SizeDown, Spin } from '../../../utils/sound';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 90%;
  height: 80%;
`;

const Guide = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 20%;
  font-size: 35px;
  font-weight: 400;
  text-shadow: 0 0 2px #fff, 0 0 4px #fff;
`;

const ModeWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 80%;
  padding: 20px;
  margin-top: 10px;
`;

const ModeName = styled.div<{ keys: number; highlighted: number }>`
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  width: 100%;
  height: 15%;
  font-size: 20px;
  font-weight: 600;

  ${(p) =>
    p.keys === p.highlighted &&
    css`
      font-weight: 400;
      text-shadow: 0 0 2px #fff, 0 0 1px #fff, 0 0 10px #fff, 0 0 10px #ff007f, 0 0 15px #ff007f,
        0 0 10px #ff007f, 0 0 15px #ff007f, 0 0 20px #ff007f;
    `}
`;

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

const ModeImg = styled.img`
  width: 100%;
  height: 85%;
  max-width: 280px;
  max-height: 280px;
`;

const Mode = styled.div<{ mode: string }>`
  padding: 10px;
  border: 2px solid #ff007f88;
  border-radius: 5px;
  width: 22%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  object-fit: cover;
  transition: 0.3s;
  filter: grayscale(25%);

  &:hover {
    border: 1px solid #fff;
    filter: none;
    box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 0.3rem #ff007f, 0 0 0.4rem #ff007f,
      0 0 1rem #ff007f, inset 0 0 0.3rem #ff007f;
    transform: scale(1.2);

    & ${ModeImg} {
      ${(p) =>
        p.mode === '블러' &&
        css`
          animation: ${blur} 1s;
          animation-fill-mode: forwards;
        `}
      ${(p) =>
        p.mode === '회전' &&
        css`
          animation: ${spin} 1s infinite;
        `}
  ${(p) =>
        p.mode === '축소' &&
        css`
          animation: ${sizeDown} 1s;
          animation-fill-mode: forwards;
        `}
      animation-delay: 0.3s;
    }
  }
`;

const mode = ['노말', '블러', '회전', '축소'];
const modeImg = [img1, img2, img3, img4];
const sound = [ButtonClick4, Blur, Spin, SizeDown];

function GameModeGuide() {
  const [highlighted, setHighlighted] = useState<number>(-1);
  const [intervalId, setIntervalId] = useState<NodeJS.Timer>();
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('마우스를 올리면 설명이 나타납니다');

  function initConcen() {
    setHighlighted(-1);
    setTitle('');
    setBody('마우스를 올리면 설명이 나타납니다');
    if (intervalId) clearInterval(intervalId);
  }

  function playSound(idx: number) {
    if (idx === 0) {
      sound[idx].play();
      setTitle('노말모드　');
      setBody('상대방의 자세를 정확히 따라하면 됩니다');
    } else if (idx === 1) {
      sound[idx].play();
      setTitle('블러모드　');
      setBody('상대방의 화면이 흐려집니다');
    } else if (idx === 2) {
      sound[idx].play();
      setTitle('회전모드　');
      setBody('상대방의 화면이 회전합니다');
      setIntervalId(setInterval(() => sound[idx].play(), 1000));
    } else if (idx === 3) {
      sound[idx].play();
      setTitle('축소모드　');
      setBody('상대방의 화면이 작아집니다');
    }
  }

  return (
    <Container>
      <Guide>
        <p
          style={{
            textShadow:
              '0 0 2px #fff, 0 0 1px #fff, 0 0 10px #fff, 0 0 10px #ff007f, 0 0 15px #ff007f, 0 0 10px #ff007f, 0 0 15px #ff007f, 0 0 20px #ff007f',
          }}
        >
          {title}
        </p>
        {body}
      </Guide>
      <ModeWrapper>
        {mode.map((val, key) => (
          <Mode
            key={key}
            onMouseEnter={() => {
              setHighlighted(key);
              playSound(key);
            }}
            onMouseLeave={initConcen}
            mode={val}
          >
            <ModeName keys={key} highlighted={highlighted}>
              {val}
            </ModeName>
            <ModeImg src={modeImg[key]} />
          </Mode>
        ))}
      </ModeWrapper>
    </Container>
  );
}

export default GameModeGuide;
