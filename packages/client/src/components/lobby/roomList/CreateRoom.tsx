import { Button, Modal } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';

interface Props {
  nickName: string;
  socket: Socket;
}

export default function CreateRoom({ nickName, socket }: Props) {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);

  let roomName: string = '';

  const joinRoom = () => {
    socket.on('new_room', (roomId: string) => {
      console.log('방 입장');
      navigate('/room', {
        state: {
          roomId,
          nickName,
        },
      });
    });
  };

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    socket.emit('create_room', roomName);
    setOpen(false);
    joinRoom();
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <div>
      <div style={{ textAlign: 'center' }}>
        <Button type="default" onClick={showModal}>
          방만들기
        </Button>
      </div>
      <Modal
        title="방 만들기"
        open={open}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelText="취소"
        okText="방 생성"
      >
        <input
          type="text"
          placeholder="방 이름"
          onChange={(e) => {
            roomName = e.target.value;
          }}
        />
      </Modal>
    </div>
  );
}
