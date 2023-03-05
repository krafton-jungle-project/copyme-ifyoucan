import { useAtom, useSetAtom } from 'jotai';
import type { IGameMode } from 'project-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { createRoomModalAtom, fadeOutAtom, GameMode, roomInfoAtom } from '../../../app/room';
import { useClientSocket } from '../../../module/client-socket';
import { myNickName } from '../../../pages/Lobby';

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

const Modal = styled.div<{ isOpened: boolean; isVisible: boolean }>`
  border: 2px solid yellow;
  border-radius: 15px;
  position: absolute;
  transform: translate(-50%);
  width: 35vw;
  height: 55vh;
  left: 50%;
  min-width: 515px;
  max-height: 400px;
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
  font-size: 1.2rem;
  height: 33%;
  display: flex;
  align-items: center;
`;

const SelSpan = styled.span<{
  lang: string;
  keys: number;
  selected1: number;
  selected2: number;
  selected3: number;
}>`
  cursor: pointer;
  ${(p) =>
    p.lang === '1' &&
    p.keys === p.selected1 &&
    css`
      text-shadow: 0 0 2px #fff, 0 0 1px #fff, 0 0 10px #fff, 0 0 20px #bc13fe, 0 0 30px #bc13fe,
        0 0 20px #bc13fe, 0 0 30px #bc13fe, 0 0 50px #bc13fe;
    `}
  ${(p) =>
    p.lang === '2' &&
    p.keys === p.selected2 &&
    css`
      text-shadow: 0 0 2px #fff, 0 0 1px #fff, 0 0 10px #fff, 0 0 20px #bc13fe, 0 0 30px #bc13fe,
        0 0 20px #bc13fe, 0 0 30px #bc13fe, 0 0 50px #bc13fe;
    `}
    ${(p) =>
    p.lang === '3' &&
    p.keys === p.selected3 &&
    css`
      text-shadow: 0 0 2px #fff, 0 0 1px #fff, 0 0 10px #fff, 0 0 20px #bc13fe, 0 0 30px #bc13fe,
        0 0 20px #bc13fe, 0 0 30px #bc13fe, 0 0 50px #bc13fe;
    `}
`;

const modeName = ['일반', '블러', '축소', '회전'];
const round = [1, 2, 3];

function CreateRoomModal() {
  const { socket } = useClientSocket();
  const setRoomInfo = useSetAtom(roomInfoAtom);
  const navigate = useNavigate();
  const [roomName, setRoomName] = useState<string>('');
  const [open, setOpen] = useAtom(createRoomModalAtom);
  const [visible, setVisible] = useAtom(fadeOutAtom);
  const [gameMode, setGameMode] = useState({
    round1: GameMode.NORMAL,
    round2: GameMode.NORMAL,
    round3: GameMode.NORMAL,
  });
  const [r1, setR1] = useState<number>(0);
  const [r2, setR2] = useState<number>(0);
  const [r3, setR3] = useState<number>(0);

  const joinRoom = () => {
    socket.on('new_room', (roomId: string, gameMode: IGameMode) => {
      // 방 생성자는 호스트가 된다.
      setRoomInfo(() => ({
        roomId,
        host: true,
        gameMode,
      }));
      navigate('/room', { replace: true });
    });
  };

  const handleOk = () => {
    setOpen(false);
    socket.emit('create_room', {
      roomName: roomName ? roomName : `${myNickName}님의 방`,
      gameMode,
      thumbnailIdx: Math.floor(Math.random() * 7),
    });
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
      case '일반':
        setGameMode((prev) => ({ ...prev, [round]: GameMode.NORMAL }));
        break;
      case '블러':
        setGameMode((prev) => ({ ...prev, [round]: GameMode.BLUR }));
        break;
      case '축소':
        setGameMode((prev) => ({ ...prev, [round]: GameMode.SIZEDOWN }));
        break;
      case '회전':
        setGameMode((prev) => ({ ...prev, [round]: GameMode.ROTATE }));
        break;
      default:
        break;
    }
  };

  const clickedMode = (e: any, keys: number) => {
    switch (e.target.lang) {
      case '1':
        setR1(keys);
        break;
      case '2':
        setR2(keys);
        break;
      case '3':
        setR3(keys);
        break;
    }
  };

  return (
    <>
      {open && <ModalBackground isOpened={open} onClick={lazyClose} isVisible={visible} />}
      <Modal isOpened={open} isVisible={visible}>
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
            {round.map((val, key) => (
              <RoundDiv key={key}>Round {val} :</RoundDiv>
            ))}
          </RoundWrapper>
          <SelectionWrapper>
            {round.map((val, key) => (
              <SelectionDiv key={key}>
                {modeName.map((val2, key2) => (
                  <div key={key2}>
                    <SelSpan
                      keys={key2}
                      lang={val.toString()}
                      selected1={r1}
                      selected2={r2}
                      selected3={r3}
                      onClick={(e) => {
                        handleMode(e);
                        clickedMode(e, key2);
                      }}
                    >
                      {val2}
                    </SelSpan>
                    {key2 < 3 && <span>　|　</span>}
                  </div>
                ))}
              </SelectionDiv>
            ))}
          </SelectionWrapper>
        </ModeDiv>
        <Button onClick={handleOk}>생성하기</Button>
      </Modal>
    </>
  );
}

export default CreateRoomModal;
