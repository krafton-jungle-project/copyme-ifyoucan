import { Modal } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { useClientSocket } from '../../../module/client-socket';
import { roomInfoAtom } from '../../../app/room';
import styled from 'styled-components';
import { ButtonClick1, ButtonClick2 } from '../../../utils/sound';

const Button = styled.button`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  right: 0;
  height: 100%;
  padding: 0 10px 0 10px;
  font-size: 18px;
  font-weight: 400;
  background-color: #9900ff1e;
  border: 1px solid pink;
  border-radius: 5px;
  color: white;
  cursor: pointer;
  &:hover {
    text-shadow: 0 0 1px #fff, 0 0 3px #fff;
  }
  transition: 0.2s;
`;

export default function CreateRoom() {
  const { socket } = useClientSocket();
  const navigate = useNavigate();
  const setRoomInfo = useSetAtom(roomInfoAtom);
  const [open, setOpen] = useState<boolean>(false);
  let roomName = '';

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

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setOpen(false);
    socket.emit('create_room', roomName);
    joinRoom();
  };

  const handleCancel = () => {
    ButtonClick2.play();
    setOpen(false);
  };

  return (
    <>
      <Button
        onClick={() => {
          ButtonClick1.play();
          showModal();
        }}
      >
        방만들기
      </Button>
      <Modal
        title="Create Room"
        open={open}
        okText="Create"
        cancelText="Cancle"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <input
          type="text"
          placeholder="방 이름을 입력하세요"
          onChange={(e) => {
            roomName = e.target.value;
          }}
        />
      </Modal>
    </>
  );
}
