import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import styled from 'styled-components';
import { tutorialPassAtom } from '../../../app/tutorial';
import partyPopperImg from '../../../assets/images/lobby/tutorial/party-popper.gif';
import { Yeah } from '../../../utils/sound';
import Guide from './Guide';
import PoseCam from './PoseCam';
import PoseImg from './PoseImg';

const Container = styled.div`
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: grid;
  grid-template-columns: 50% 50%;
  grid-template-rows: 20% 80%;
  grid-auto-flow: rows;
  width: 80%;
  height: 90%;
`;

const ImgWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin: 20px 30px;
  border: 1px solid #f0c;
  background-color: #f0c1;
  border-radius: 5px;
`;

const CameraWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 20px 30px;
`;

const PartyPopper = styled.img`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
`;

function Tutorial() {
  const isPass = useAtomValue(tutorialPassAtom);

  useEffect(() => {
    if (isPass) {
      Yeah.play();
    }
  }, [isPass]);

  return (
    <Container>
      <Guide />
      <ImgWrapper>
        <PoseImg />
      </ImgWrapper>
      <CameraWrapper>
        <PoseCam />
      </CameraWrapper>
      {isPass ? <PartyPopper src={partyPopperImg} /> : null}
    </Container>
  );
}

export default Tutorial;
