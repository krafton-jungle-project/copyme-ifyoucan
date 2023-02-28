import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import good from '../../../assets/images/score/good.gif';
import great from '../../../assets/images/score/great.gif';
import perfect from '../../../assets/images/score/perfect.gif';
import fail from '../../../assets/images/score/fail.gif';
import { Fail, Stamp } from '../../../utils/sound';

const GradeImg = styled.img<{ isMe: boolean }>`
  position: absolute;

  ${(props) =>
    props.isMe &&
    css`
      top: 80%;
      left: 15%;
    `}
  ${(props) =>
    !props.isMe &&
    css`
      top: 80%;
      right: 14%;
    `}
`;

function Grade({ score, isMe }: { score: number; isMe: boolean }) {
  const [gradeImg, setGradeImg] = useState('');

  useEffect(() => {
    if (score > 50) {
      if (score > 90) {
        setGradeImg(perfect);
      } else if (score > 70) {
        setGradeImg(great);
      } else {
        setGradeImg(good);
      }
      Stamp.play();
    } else {
      setGradeImg(fail);
      Fail.play();
    }
  }, [score]);

  return <GradeImg src={gradeImg} alt="grade" isMe={isMe} />;
}

export default Grade;
