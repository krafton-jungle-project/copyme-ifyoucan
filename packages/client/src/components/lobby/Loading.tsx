import { useAtom } from 'jotai';
import { useEffect } from 'react';
import styled from 'styled-components';
import loadingImg from '../../assets/images/loading.gif';
import { isLoadedAtom } from '../../pages/Lobby';
import * as movenet from '../../utils/tfjs-movenet';

const LoadingContainer = styled.div`
  margin-top: 150px;
  width: auto;
  height: auto;
  text-align: center;
`;

function Loading() {
  const [isLoaded, setIsLoaded] = useAtom(isLoadedAtom);

  useEffect(() => {
    async function mediaLoad() {
      // Login하여 처음 Lobby로 이동 시, stream 및 detector를 초기화 해준다.

      await movenet.getMyStream({ width: 400, height: 300 }); // TODO: 임시 수정
      console.log('webcam stream is ready.');

      await movenet.createDetector();
      console.log('pose detector is ready.');

      setIsLoaded(true);
    }
    if (!isLoaded) mediaLoad();
  }, []);
  console.log(21311);

  return (
    <LoadingContainer>
      <img src={loadingImg} />
      <h1>로딩중입니다. </h1>
      <h1>잠시만 기다려주세요</h1>
    </LoadingContainer>
  );
}

export default Loading;
