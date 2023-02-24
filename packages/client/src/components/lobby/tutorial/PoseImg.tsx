import { useAtomValue } from 'jotai';
import styled from 'styled-components';
import { tutorialImgAtom } from '../../../app/tutorial';

const ImgWrapper = styled.div`
  height: 50%;
  width: 95%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Img = styled.img`
  width: 95%;
`;

function PoseImg() {
  const img = useAtomValue(tutorialImgAtom);

  return (
    <ImgWrapper>
      <img src={img} alt="pose" />
    </ImgWrapper>
  );
}

export default PoseImg;
