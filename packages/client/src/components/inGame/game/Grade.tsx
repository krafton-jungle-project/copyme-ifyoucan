import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import good from '../../../assets/images/score/good.gif';
import great from '../../../assets/images/score/great.gif';
import perfect from '../../../assets/images/score/perfect.gif';
import bad from '../../../assets/images/score/bad.gif';
import fail from '../../../assets/images/score/fail.gif';
import { Fail, Stamp } from '../../../utils/sound';

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
    if (score > 60) {
      if (score > 90) {
        setGradeImg(perfect);
      } else if (score > 80) {
        setGradeImg(great);
      } else if (score > 70) {
        setGradeImg(good);
      } else {
        setGradeImg(bad);
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
