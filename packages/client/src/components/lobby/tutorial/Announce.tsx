import { useAtom, useAtomValue, useSetAtom } from 'jotai';
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
import startImg from '../../../assets/images/tutorial/leggo.webp';
import defaultImg from '../../../assets/images/tutorial/mario.png';
import leftHandUp from '../../../assets/images/tutorial/left.png';
import rightHandUp from '../../../assets/images/tutorial/right.png';
import TPose from '../../../assets/images/tutorial/tpose.jpeg';
import SDR from '../../../assets/images/tutorial/SDR.png';

const Announcement = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 2px solid red;
  height: 15%;
  width: 95%;
  font-size: 30px;
  font-weight: 700;
`;

function Announce() {
  const [content, setContent] = useState('튜토리얼');

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
      setContent(`마리오를 눌러 시작해주세요.`);
      setImg(startImg);
    }
    if (isStarted && !isBody) {
      setContent(`전신이 나오게 서주세요.`);
      setImg(defaultImg);
    }

    if (isBody && isStarted) {
      if (!isLeft) {
        setContent(`왼손을 들어주세요.`);
        setImg(leftHandUp);
      }
      if (isLeft && !isRight) {
        setContent(`오른손을 들어주세요.`);
        setImg(rightHandUp);
      }
      if (isLeft && isRight && !isT) {
        setContent(`양팔 벌려 서주세요.`);
        setImg(TPose);
      }
      if (isLeft && isRight && isT && !isSDR) {
        setContent(`상상도 못한 포즈를 해주세요.`);
        setImg(SDR);
      }
      if (isPass) {
        setContent(`수고하셨습니다.`);
        setImg(defaultImg);
      }
    }
  }, [isStarted, isBody, isLeft, isRight, isT, isSDR, isPass]);

  return <Announcement>{content}</Announcement>;
}

export default Announce;
