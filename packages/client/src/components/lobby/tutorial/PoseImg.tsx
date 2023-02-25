import { useAtomValue, useSetAtom } from 'jotai';
import styled from 'styled-components';
import { isStartedAtom, tutorialImgAtom } from '../../../app/tutorial';

const ImgWrapper = styled.div`
  height: 50%;
  width: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Img = styled.img`
  height: 85%;
  width: auto;
`;

function PoseImg() {
  const img = useAtomValue(tutorialImgAtom);
  const setIsStarted = useSetAtom(isStartedAtom);

  const startTutorial = () => {
    setIsStarted(true);
  };

  return (
    <ImgWrapper>
      <Img src={img} alt="pose" onClick={startTutorial} />
    </ImgWrapper>
  );
}

export default PoseImg;
