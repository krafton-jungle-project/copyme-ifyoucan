import { useAtom, useSetAtom } from 'jotai';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { ItemType } from '../../../app/game';
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
  width: 35vw;
  height: 55vh;
  left: 50%;
  max-height: 400px;
  max-width: 600px;
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

const ModeDiv = styled.div`
  border: 2px solid #fff;
  border-radius: 10px;

  padding: 2% 0 2% 5%;
  height: 40%;
  width: 85%;
  display: flex;
  /* flex-direction: column; */
  justify-content: space-evenly;
  align-items: center;
`;

const RoundWrapper = styled.div`
  width: 27%;
  height: 100%;
`;

const RoundDiv = styled.div`
  height: 33%;
  width: 100%;
  display: flex;
  align-items: center;
  font-size: 1.2rem;
`;

const SelectionWrapper = styled.div`
  width: 73%;
  height: 100%;
`;

const SelectionDiv = styled.div`
  /* position: absolute; */
  font-size: 1.2rem;
  height: 33%;
  display: flex;
  align-items: center;
`;

const SelSpan = styled.span`
  cursor: pointer;
`;

function CreateRoomModal() {
  const { socket } = useClientSocket();
  const setRoomInfo = useSetAtom(roomInfoAtom);
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState<string>('');
  const [open, setOpen] = useAtom(createRoomModalAtom);
  const [visible, setVisible] = useAtom(fadeOutAtom);
  const [itemType, setItemType] = useState({
    round1: ItemType.NORMAL,
    round2: ItemType.NORMAL,
    round3: ItemType.NORMAL,
  });

  const joinRoom = () => {
    socket.on('new_room', (roomId: string) => {
      // 방 생성자는 호스트가 된다.
      setRoomInfo(() => ({
        roomId,
        host: true,
        itemType,
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

  const handleMode = (e: any) => {
    let round: string = `round${e.target.lang}`;
    switch (e.target.innerText) {
      case '노말':
        setItemType((prev) => ({ ...prev, [round]: ItemType.NORMAL }));
        break;
      case '블러':
        setItemType((prev) => ({ ...prev, [round]: ItemType.BLUR }));
        break;
      case '축소':
        setItemType((prev) => ({ ...prev, [round]: ItemType.SIZEDOWN }));
        break;
      case '회전':
        setItemType((prev) => ({ ...prev, [round]: ItemType.ROTATE }));
        break;
      default:
        break;
    }
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
        <Title>모드 선택</Title>
        <ModeDiv>
          <RoundWrapper>
            <RoundDiv>Round 1 :</RoundDiv>
            <RoundDiv>Round 2 :</RoundDiv>
            <RoundDiv>Round 3 :</RoundDiv>
          </RoundWrapper>
          <SelectionWrapper>
            <SelectionDiv>
              <SelSpan lang="1" onClick={handleMode}>
                노말
              </SelSpan>
              <span>　|　</span>
              <SelSpan lang="1" onClick={handleMode}>
                블러
              </SelSpan>
              <span>　|　</span>
              <SelSpan lang="1" onClick={handleMode}>
                축소
              </SelSpan>
              <span>　|　</span>
              <SelSpan lang="1" onClick={handleMode}>
                회전
              </SelSpan>
            </SelectionDiv>
            <SelectionDiv>
              <SelSpan lang="2" onClick={handleMode}>
                노말
              </SelSpan>
              <span>　|　</span>
              <SelSpan lang="2" onClick={handleMode}>
                블러
              </SelSpan>
              <span>　|　</span>
              <SelSpan lang="2" onClick={handleMode}>
                축소
              </SelSpan>
              <span>　|　</span>
              <SelSpan lang="2" onClick={handleMode}>
                회전
              </SelSpan>
            </SelectionDiv>
            <SelectionDiv>
              <SelSpan lang="3" onClick={handleMode}>
                노말
              </SelSpan>
              <span>　|　</span>
              <SelSpan lang="3" onClick={handleMode}>
                블러
              </SelSpan>
              <span>　|　</span>
              <SelSpan lang="3" onClick={handleMode}>
                축소
              </SelSpan>
              <span>　|　</span>
              <SelSpan lang="3" onClick={handleMode}>
                회전
              </SelSpan>
            </SelectionDiv>
          </SelectionWrapper>
        </ModeDiv>
        <Button onClick={handleOk}>생성하기</Button>
      </Modal2>
    </>
  );
}

export default CreateRoomModal;
