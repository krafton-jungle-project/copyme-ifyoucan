import { Button, Modal } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetAtom } from 'jotai';
import { useClientSocket } from '../../../module/client-socket';
import { roomInfoAtom } from '../../../app/room';

export default function CreateRoom() {
  const { socket } = useClientSocket();
  const navigate = useNavigate();
  const setRoomInfo = useSetAtom(roomInfoAtom);
  const [open, setOpen] = useState<boolean>(false);

  let roomName: string = '';

  const joinRoom = () => {
    socket.on('new_room', (roomId: string) => {
      // 방 생성자는 호스트가 된다.
      setRoomInfo(() => ({
        roomId,
        host: true,
      }));
      navigate('/room');
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
        okText="방 생성"
        cancelText="취소"
        onOk={handleOk}
        onCancel={handleCancel}
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
