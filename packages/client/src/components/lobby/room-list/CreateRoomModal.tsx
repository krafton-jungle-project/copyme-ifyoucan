import { useAtom, useSetAtom } from 'jotai';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { createRoomModalAtom, fadeOutAtom, roomInfoAtom } from '../../../app/room';
import { useClientSocket } from '../../../module/client-socket';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const ModalBackground = styled.div<{ isOpened: boolean; isVisible: boolean }>`
  background-color: rgba(0, 0, 0, 0.5);
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  width: 100vw;
  height: 147vh;
  z-index: 1;

  ${(p) =>
    p.isOpened &&
    css`
      animation: ${fadeIn} 0.7s;
    `}

  ${(p) =>
    !p.isVisible &&
    css`
      animation: ${fadeOut} 0.3s;
    `}
`;

const Modal2 = styled.div<{ isOpened: boolean; isVisible: boolean }>`
  border: 2px solid yellow;
  border-radius: 15px;
  position: absolute;
  transform: translate(-50%);
  width: 30vw;
  height: 35vh;
  left: 50%;
  max-height: 250px;
  max-width: 500px;
  background-color: #01000d;
  z-index: 999;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;

  ${(p) =>
    p.isOpened &&
    css`
      animation: ${fadeIn} 0.7s;
    `}

  ${(p) =>
    !p.isVisible &&
    css`
      animation: ${fadeOut} 0.3s;
    `}
`;

const Span = styled.span`
  border: 2px solid yellow;
  position: absolute;
  right: 5%;
  top: 8%;
  padding: 1% 2%;
  cursor: pointer;
  border-radius: 10px;
  font-weight: 700;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #f0ffa744;
    text-shadow: 0 0 2px #fff;
  }
`;

const Title = styled.div`
  font-size: 27px;
  font-weight: 700;
`;

const Input = styled.input`
  padding: 3% 4%;
  width: 70%;
  border: 2px solid #fffe;
  border-radius: 10px;
  font-size: large;
  background-color: transparent;
  color: #fff;

  &::placeholder {
    color: #fffd;
  }

  &:focus {
    transition: 0.3s;
    box-shadow: 0 0 0.1rem #fff, 0 0 0.1rem #fff, 0 0 0.4rem #fff, 0 0 0.4rem #fff, 0 0 0.6rem #fff,
      inset 0 0 0.4rem #fff;
    outline: none;
  }
`;

const Button = styled.button`
  border: 2px solid yellow;
  background-color: transparent;
  border-radius: 10px;
  padding: 2% 0;
  width: 35%;
  font-size: larger;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #f0ffa744;
    text-shadow: 0 0 2px #fff;
  }
`;

function CreateRoomModal() {
  const { socket } = useClientSocket();
  const setRoomInfo = useSetAtom(roomInfoAtom);
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState<string>('');
  const [open, setOpen] = useAtom(createRoomModalAtom);
  const [visible, setVisible] = useAtom(fadeOutAtom);

  const joinRoom = () => {
    socket.on('new_room', (roomId: string) => {
      // 방 생성자는 호스트가 된다.
      setRoomInfo(() => ({
        roomId,
        host: true,
      }));
      navigate('/room', { replace: true });
    });
  };

  const handleOk = () => {
    setOpen(false);
    socket.emit('create_room', roomName);
    joinRoom();
  };

  const lazyClose = () => {
    setVisible(false);
    setTimeout(() => {
      setOpen(false);
    }, 300);
  };

  return (
    <>
      {open && <ModalBackground isOpened={open} onClick={lazyClose} isVisible={visible} />}
      <Modal2 isOpened={open} isVisible={visible}>
        <Span onClick={lazyClose}>X</Span>
        <Title>방 만들기</Title>
        <Input
          type="text"
          placeholder="방 제목을 입력해주세요"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setRoomName(e.target.value);
          }}
          value={roomName}
        />
        <Button onClick={handleOk}>생성하기</Button>
      </Modal2>
    </>
  );
}

export default CreateRoomModal;
