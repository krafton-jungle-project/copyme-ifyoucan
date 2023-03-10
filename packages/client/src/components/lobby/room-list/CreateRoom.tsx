import { useAtom, useSetAtom } from 'jotai';
import styled from 'styled-components';
import { createRoomModalAtom, fadeOutAtom } from '../../../app/room';
import { ButtonClick1 } from '../../../utils/sound';
import CreateRoomModal from './CreateRoomModal';

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
  border: 1px solid #ffc0cb;
  border-radius: 5px;
  color: #fff;
  cursor: pointer;
  &:hover {
    text-shadow: 0 0 1px #fff, 0 0 3px #fff;
  }
  transition: 0.2s;
`;

function CreateRoom() {
  const [open, setOpen] = useAtom(createRoomModalAtom);
  const setVisible = useSetAtom(fadeOutAtom);

  const showModal = () => {
    setOpen(true);
    setVisible(true);
  };

  return (
    <>
      {open && <CreateRoomModal />}
      <Button
        onClick={() => {
          ButtonClick1.play();
          showModal();
        }}
      >
        방만들기
      </Button>
    </>
  );
}

export default CreateRoom;
