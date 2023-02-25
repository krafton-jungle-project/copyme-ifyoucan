import { useAtom, useAtomValue } from 'jotai';
import styled, { css } from 'styled-components';
import { isStartedAtom, tutorialImgAtom } from '../../../app/tutorial';

const ImgWrapper = styled.div`
  height: 50%;
  width: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Img = styled.img<{ isStarted: boolean }>`
  height: 85%;
  width: auto;
  ${(props) =>
    !props.isStarted &&
    css`
      cursor: pointer;
    `}
`;

function PoseImg() {
  const img = useAtomValue(tutorialImgAtom);
  const [isStarted, setIsStarted] = useAtom(isStartedAtom);

  const startTutorial = () => {
    setIsStarted(true);
  };

  return (
    <ImgWrapper>
      <Img src={img} alt="pose" onClick={startTutorial} isStarted={isStarted} />
    </ImgWrapper>
  );
}

export default PoseImg;
