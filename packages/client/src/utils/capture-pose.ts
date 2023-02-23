import html2canvas from 'html2canvas';
import type { Socket } from 'socket.io-client';

let data: [string, string] = ['', ''];

// 이미지와 keypoints 데이터 보내는 이벤트는 캡처할 때 밖에 없으므로 여기서 소켓 통신까지 함
async function emitDataToDefender(imgSrc: string, flag: number, socket: Socket) {
  data[flag] = imgSrc;

  if (data[0] !== '' && data[1] !== '') {
    socket.emit('image', data);
    data = ['', ''];
  }
}

/**
 * @param flag
 * flag === 0 : 공격자 이미지
 * flag === 1 : 수비자 이미지
 */

export async function capturePose(
  toCapture: HTMLVideoElement,
  toDraw: HTMLCanvasElement,
  flag?: number,
  socket?: Socket,
) {
  if (toCapture !== null) {
    // 캡처할 html 요소를 넣으면 return 값이 'HTMLCanvasElement'로 나옴
    await html2canvas(toCapture).then(async (canvas: HTMLCanvasElement) => {
      const ctx = toDraw.getContext('2d') as CanvasRenderingContext2D;
      ctx.drawImage(canvas, 0, 0, 640, 480);

      if (socket && (flag === 0 || flag === 1)) {
        let imgSrc: string = canvas.toDataURL('image/webp', 0.5);
        emitDataToDefender(imgSrc, flag, socket);
      }
    });
  }
}
