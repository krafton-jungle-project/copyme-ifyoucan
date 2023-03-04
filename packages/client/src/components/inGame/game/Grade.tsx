import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import badImg from '../../../assets/images/in-game/grade/bad.gif';
import failImg from '../../../assets/images/in-game/grade/fail.gif';
import goodImg from '../../../assets/images/in-game/grade/good.gif';
import greatImg from '../../../assets/images/in-game/grade/great.gif';
import perfectImg from '../../../assets/images/in-game/grade/perfect.gif';
import { Fail, Great, Perfect, Stamp } from '../../../utils/sound';

const GradeImg = styled.img<{ isMe: boolean }>`
  position: absolute;
  bottom: 0;
  width: 120%;
  ${(props) =>
    props.isMe &&
    css`
      left: 0;
    `}
  ${(props) =>
    !props.isMe &&
    css`
      right: 0;
    `}
`;

function Grade({ score, isMe }: { score: number; isMe: boolean }) {
  const [gradeImg, setGradeImg] = useState('');

  useEffect(() => {
    if (score >= 60) {
      if (score >= 90) {
        setGradeImg(perfectImg);
        setTimeout(() => {
          Perfect.play();
        }, 300);
      } else if (score >= 80) {
        setGradeImg(greatImg);
        setTimeout(() => {
          Great.play();
        }, 300);
      } else if (score >= 70) {
        setGradeImg(goodImg);
      } else {
        setGradeImg(badImg);
      }
      Stamp.play();
    } else {
      setGradeImg(failImg);
      Fail.play();
    }
  }, [score]);

  return <GradeImg src={gradeImg} alt="grade" isMe={isMe} />;
}

export default Grade;
