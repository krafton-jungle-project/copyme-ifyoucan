import type * as poseDetection from '@tensorflow-models/pose-detection';
import type { Socket } from 'socket.io-client';
import html2canvas from 'html2canvas';

// 이미지와 keypoints 데이터 보내는 이벤트는 캡처할 때 밖에 없으므로 여기서 소켓 통신까지 함
async function emitDataToDefender(imgSrc: string, socket: Socket) {
  socket.emit('image');
}

export async function capturePose(
  toCapture: HTMLVideoElement,
  toDraw: HTMLCanvasElement,
  socket?: Socket,
) {
  if (toCapture !== null) {
    // 캡처할 html 요소를 넣으면 return 값이 'HTMLCanvasElement'로 나옴
    await html2canvas(toCapture).then(async (canvas: HTMLCanvasElement) => {
      const ctx = toDraw.getContext('2d') as CanvasRenderingContext2D;
      ctx.drawImage(canvas, 0, 0, 640, 480);
      let imgSrc: string = canvas.toDataURL();

      if (socket) {
        emitDataToDefender(imgSrc, socket);
      }
    });
  }
}
