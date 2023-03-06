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

export function capturePose(
  toCapture: HTMLVideoElement,
  toDraw: HTMLCanvasElement,
  flag?: number,
  socket?: Socket,
) {
  if (toCapture !== null) {
    const ctx = toDraw.getContext('2d') as CanvasRenderingContext2D;
    ctx.drawImage(toCapture, 0, 0, 640, 480);
    if (socket && (flag === 0 || flag === 1)) {
      const imgSrc: string = toDraw.toDataURL('image/webp', 0.5);
      emitDataToDefender(imgSrc, flag, socket);
    }
  }
}
