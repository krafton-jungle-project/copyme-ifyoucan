import { useAtomValue, useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  isBodyAtom,
  isLeftAtom,
  isRightAtom,
  isSDRAtom,
  isStartedAtom,
  isTPoseAtom,
  tutorialImgAtom,
  tutorialPassAtom,
} from '../../../app/tutorial';
import defaultImg from '../../../assets/images/tutorial/standing.png';
import leftHandUp from '../../../assets/images/tutorial/left.png';
import rightHandUp from '../../../assets/images/tutorial/right.png';
import TPose from '../../../assets/images/tutorial/tpose.png';
import SDR from '../../../assets/images/tutorial/SDR.png';
import { ButtonClick } from '../../../utils/sound';

const Container = styled.div`
  grid-column: 1 / 3;
  grid-row: 1/ 2;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 100px;
  font-size: 35px;
  font-weight: 400;
  text-shadow: 0 0 2px #fff, 0 0 4px #fff;
  border: 1px solid #fff;
  border-radius: 10px;
  box-shadow: 0 0 0.1rem #fff, 0 0 0.3rem #fff;
`;

function Guide() {
  const [content, setContent] = useState('');

  const setImg = useSetAtom(tutorialImgAtom);
  const isStarted = useAtomValue(isStartedAtom);
  const isBody = useAtomValue(isBodyAtom);
  const isLeft = useAtomValue(isLeftAtom);
  const isRight = useAtomValue(isRightAtom);
  const isT = useAtomValue(isTPoseAtom);
  const isSDR = useAtomValue(isSDRAtom);
  const isPass = useAtomValue(tutorialPassAtom);

  useEffect(() => {
    if (!isStarted) {
      setContent('버튼을 누르면 시작됩니다');
    }
    if (isStarted && !isBody) {
      ButtonClick.play();
      setContent('전신이 보이도록 서주세요');
      setImg(defaultImg);
    }

    if (isBody && isStarted) {
      if (!isLeft) {
        setContent('왼손을 들어주세요');
        setImg(leftHandUp);
        console.log(leftHandUp);
      }
      if (isLeft && !isRight) {
        setContent('오른손을 들어주세요');
        setImg(rightHandUp);
      }
      if (isLeft && isRight && !isT) {
        setContent('양팔을 벌려주세요');
        setImg(TPose);
      }
      if (isLeft && isRight && isT && !isSDR) {
        setContent('상상도 못한 자세를 해주세요');
        setImg(SDR);
      }
      if (isPass) {
        setContent('수고하셨습니다');
        setImg(defaultImg);
      }
    }
  }, [isStarted, isBody, isLeft, isRight, isT, isSDR, isPass, setImg]);

  return <Container>{content}</Container>;
}

export default Guide;
