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
import leftHandUpImg from '../../../assets/images/lobby/tutorial/left.png';
import rightHandUpImg from '../../../assets/images/lobby/tutorial/right.png';
import SDRImg from '../../../assets/images/lobby/tutorial/SDR.png';
import defaultImg from '../../../assets/images/lobby/tutorial/standing.png';
import TPoseImg from '../../../assets/images/lobby/tutorial/tpose.png';
import { ButtonClick1 } from '../../../utils/sound';

const Container = styled.div`
  grid-column: 1 / 3;
  grid-row: 1 / 2;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 0;
  font-size: 35px;
  font-weight: 400;
  text-shadow: 0 0 2px #fff, 0 0 4px #fff;
`;

function Guide() {
  const setImg = useSetAtom(tutorialImgAtom);
  const isStarted = useAtomValue(isStartedAtom);
  const isBody = useAtomValue(isBodyAtom);
  const isLeft = useAtomValue(isLeftAtom);
  const isRight = useAtomValue(isRightAtom);
  const isT = useAtomValue(isTPoseAtom);
  const isSDR = useAtomValue(isSDRAtom);
  const isPass = useAtomValue(tutorialPassAtom);

  const [content, setContent] = useState<string>('');

  useEffect(() => {
    if (!isStarted) {
      setContent('시작 버튼을 눌러 튜토리얼을 시작하세요');
    }
    if (isStarted && !isBody) {
      ButtonClick1.play();
      setContent('전신이 보이도록 서주세요');
      setImg(defaultImg);
    }

    if (isBody && isStarted) {
      if (!isLeft) {
        setContent('왼손을 들어주세요');
        setImg(leftHandUpImg);
        console.log(leftHandUpImg);
      }
      if (isLeft && !isRight) {
        setContent('오른손을 들어주세요');
        setImg(rightHandUpImg);
      }
      if (isLeft && isRight && !isT) {
        setContent('양팔을 벌려주세요');
        setImg(TPoseImg);
      }
      if (isLeft && isRight && isT && !isSDR) {
        setContent('상상도 못한 자세를 해주세요');
        setImg(SDRImg);
      }
      if (isPass) {
        setContent("수고하셨습니다! Let's PLAY!");
        setImg(defaultImg);
      }
    }
  }, [isStarted, isBody, isLeft, isRight, isT, isSDR, isPass, setImg]);

  return <Container>{content}</Container>;
}

export default Guide;
