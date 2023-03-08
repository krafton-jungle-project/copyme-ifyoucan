import axios from 'axios';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import frameImgSrc from '../../assets/images/in-game/frame-img.png';
import stickerImgSrc from '../../assets/images/in-game/sticker.png';
import { useClientSocket } from '../../module/client-socket';

const Canvas = styled.canvas`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: none; // 캔버스 안보이게
`;
let sx: number;
let sy: number;
let sw: number;
let sh: number;
const dx = 40;
const dy = 70;
const offset_x = 233;
const offset_y = 338;
const dw = 187;
const dh = 249;

const InvisibleDrawingCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { socket } = useClientSocket();

  useEffect(() => {
    const upload = async (image: FormData) => {
      if (document.cookie) {
        const token = document.cookie.split('=')[1];
        try {
          const res = await axios.post(
            `http://${process.env.REACT_APP_SERVER_URL}:${process.env.REACT_APP_SERVER_PORT}/users/upload`,
            image,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`,
              },
            },
          );
          return res;
        } catch (error) {
          alert('이미지 업로드에 실패했습니다.');
        }
      }
    };

    const setDrawingImg = (width: number, height: number) => {
      sx = Math.floor((width - height) / 2);
      sy = 0;
      sw = height;
      sh = height;
    };

    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('no canvas');
      return;
    }

    canvas.width = 500;
    canvas.height = 700;

    const ctx = canvas.getContext('2d');

    const frameImg = new Image();
    frameImg.src = frameImgSrc;

    // 프레임 그리기
    frameImg.onload = () => {
      if (ctx) {
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
      }
    };

    socket.on('get_upload', (images: string[]) => {
      console.log('get_upload');

      const bestOffenderImg = new Image();
      bestOffenderImg.src = images[0];

      const worstDefenderImg = new Image();
      worstDefenderImg.src = images[1];

      const worstOffenderImg = new Image();
      worstOffenderImg.src = images[2];

      const bestDefenderImg = new Image();
      bestDefenderImg.src = images[3];

      const stickerImg = new Image();
      stickerImg.src = stickerImgSrc;

      // src의 값을 불러오고 난 후 실행
      bestOffenderImg.onload = () => {
        worstDefenderImg.onload = () => {
          worstOffenderImg.onload = () => {
            bestDefenderImg.onload = () => {
              stickerImg.onload = () => {
                if (ctx) {
                  ctx.save();
                  ctx.scale(-1, 1); // Flip horizontally

                  if (bestOffenderImg.width > bestOffenderImg.height) {
                    setDrawingImg(bestOffenderImg.width, bestOffenderImg.height);
                    ctx.drawImage(bestOffenderImg, sx, sy, sw, sh, -dx, dy, -dw, dh);
                  } else {
                    ctx.drawImage(bestOffenderImg, -dx, dy, -dw, dh);
                  }

                  if (worstDefenderImg.width > worstDefenderImg.height) {
                    setDrawingImg(worstDefenderImg.width, worstDefenderImg.height);
                    ctx.drawImage(worstDefenderImg, sx, sy, sw, sh, -(dx + offset_x), dy, -dw, dh);
                  } else {
                    ctx.drawImage(worstDefenderImg, -(dx + offset_x), dy, -dw, dh);
                  }

                  if (worstOffenderImg.width > worstOffenderImg.height) {
                    setDrawingImg(worstOffenderImg.width, worstOffenderImg.height);
                    ctx.drawImage(worstOffenderImg, sx, sy, sw, sh, -dx, dy + offset_y, -dw, dh);
                  } else {
                    ctx.drawImage(worstOffenderImg, -dx, dy + offset_y, -dw, dh);
                  }

                  if (bestDefenderImg.width > bestDefenderImg.height) {
                    setDrawingImg(bestDefenderImg.width, bestDefenderImg.height);
                    ctx.drawImage(
                      bestDefenderImg,
                      sx,
                      sy,
                      sw,
                      sh,
                      -(dx + offset_x),
                      dy + offset_y,
                      -dw,
                      dh,
                    );
                  } else {
                    ctx.drawImage(bestDefenderImg, -(dx + offset_x), dy + offset_y, -dw, dh);
                  }

                  ctx.restore();

                  // 스티커 그리기
                  ctx.drawImage(stickerImg, 0, 0, canvas.width, canvas.height);
                }

                // Create a new FormData object and append the blob to it
                canvas.toBlob(function (blob) {
                  const formData = new FormData();
                  if (blob) {
                    formData.append('image', blob, 'image.png');
                  }

                  // 이미지 업로드 post 요청
                  upload(formData);
                }, 'image/png');
              };
            };
          };
        };
      };
    });
    return () => {
      socket.off('get_upload');
    };
  }, []);

  return <Canvas ref={canvasRef} />;
};

export default InvisibleDrawingCanvas;
