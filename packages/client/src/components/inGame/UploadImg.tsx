import axios from 'axios';
import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { useClientSocket } from '../../module/client-socket';

const Canvas = styled.canvas`
  -webkit-transform: scaleX(-1);
  transform: scaleX(-1);
  position: absolute;
  background-color: rgba(255, 255, 255, 0.1);
  visibility: 'visible';
  left: 20%;
  /* z-index: 10; */
`;
const dW = 300;
const dH = 400;

const UploadImg = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { socket } = useClientSocket();
  useEffect(() => {
    const upload = async (image: FormData) => {
      console.log('upload');
      if (document.cookie) {
        const token = document.cookie.split('=')[1];
        try {
          // const res = await axios.post('http://15.165.237.195:5001/users/login', {
          const res = await axios.post('http://localhost:5001/users/upload', image, {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`,
            },
          });

          return res;
        } catch (error) {
          alert('로그인에 실패했습니다.');
        }
      }
    };

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 500;
    canvas.height = 700;

    const ctx = canvas.getContext('2d');
    socket.on('get_upload', (images: string[]) => {
      console.log('get_upload');
      const bestOffenderImg = new Image();
      bestOffenderImg.src = images[0];

      const bestDefenderImg = new Image();
      bestDefenderImg.src = images[1];

      const worstOffenderImg = new Image();
      worstOffenderImg.src = images[2];

      const worstDefenderImg = new Image();
      worstDefenderImg.src = images[3];

      bestOffenderImg.onload = () => {
        bestDefenderImg.onload = () => {
          worstOffenderImg.onload = () => {
            worstDefenderImg.onload = () => {
              // Draw the images onto the canvas
              if (ctx) {
                ctx.drawImage(bestOffenderImg, dW, 0, dW, dH);
                ctx.drawImage(bestDefenderImg, 0, 0, dW, dH);
                ctx.drawImage(worstOffenderImg, dW, dH, dW, dH);
                ctx.drawImage(worstDefenderImg, 0, dH, dW, dH);
              }

              // Save the canvas as a new image
              const combinedImage = canvas.toDataURL();
              // Extract the base64 data from the Data URL
              const base64Data = combinedImage.split(',')[1];

              // Convert the base64 data to binary format
              const binaryData = atob(base64Data);

              // Create a Blob object from the binary data
              const blob = new Blob([binaryData], { type: 'image/png' });

              // Create a new FormData object and append the Blob object to it
              const formData = new FormData();
              formData.append('image', blob, 'image.png');
              upload(formData);
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

export { UploadImg };
