import type * as poseDetection from '@tensorflow-models/pose-detection';
import type { Socket } from 'socket.io-client';
import html2canvas from 'html2canvas';
import getPose from './get-pose';

// 이미지와 keypoints 데이터 보내는 이벤트는 캡처할 때 밖에 없으므로 여기서 소켓 통신까지 함
async function emitDataToDefender(imgSrc: string, socket: Socket) {
  const pose = await getPose();
  if (pose !== undefined) {
    const data: { pose: poseDetection.Pose; imgSrc: string } = { pose, imgSrc };
    socket.emit('image', data);
  }
}

async function Capture(
  toDraw: HTMLCanvasElement,
  toCapture: HTMLVideoElement,
  canvasWidth: number,
  canvasHeight: number,
  socket?: Socket,
) {
  if (toDraw !== null && toCapture !== null) {
    // canvas 크기 설정
    toDraw.width = canvasWidth;
    toDraw.height = canvasHeight;

    // 캡처할 html 요소를 넣으면 return 값이 'HTMLCanvasElement'로 나옴
    await html2canvas(toCapture).then(async (canvas) => {
      const ctx = toDraw?.getContext('2d');
      ctx?.drawImage(canvas, 0, 0, canvasWidth, canvasHeight);
      let imgSrc: string = canvas.toDataURL();
      console.log(imgSrc);

      if (socket) {
        emitDataToDefender(imgSrc, socket);
      }
    });
  }
}

export default Capture;
