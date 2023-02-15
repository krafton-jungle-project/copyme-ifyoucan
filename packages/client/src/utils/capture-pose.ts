import html2canvas from 'html2canvas';
import getPose from './get-pose';

async function Capture(
  toDraw: HTMLCanvasElement,
  toCapture: HTMLVideoElement,
  canvasWidth: number,
  canvasHeight: number,
) {
  if (toDraw !== null && toCapture !== null) {
    // canvas 크기 설정
    toDraw.width = canvasWidth;
    toDraw.height = canvasHeight;

    // 캡처할 html 요소를 넣으면 return 값이 'HTMLCanvasElement'로 나옴
    await html2canvas(toCapture).then(async (canvas) => {
      const ctx = toDraw?.getContext('2d');
      ctx?.drawImage(canvas, 0, 0, canvasWidth, canvasHeight);
    });
  }

  // 캡처 시 포즈 리턴해서 서버로 보내줌
  // TODO: socket 통해서 보내줘야 할 것 : 이미지, 포즈(완) 키포인트
  let pose = await getPose();
  console.log('capture:', pose);
  return pose;
}

export default Capture;
