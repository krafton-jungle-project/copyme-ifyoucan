import { useAtom, useSetAtom } from 'jotai';
import type { IGameMode } from 'project-types';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { css, keyframes } from 'styled-components';
import { createRoomModalAtom, fadeOutAtom, GameMode, roomInfoAtom } from '../../../app/room';
import { useClientSocket } from '../../../module/client-socket';
import { getUser } from '../../../utils/local-storage';
import { ButtonClick2, ButtonClick3 } from '../../../utils/sound';

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
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: #0008;
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
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -40%);
  width: 420px;
  height: 400px;
  border: 1px solid #fff;
  border-radius: 15px;
  background-color: #01000d;
  box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 0.3rem #faed27, 0 0 0.4rem #faed27,
    0 0 1rem #faed27, inset 0 0 0.3rem #faed27;
  padding: 20px 30px;
  z-index: 1;
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
      animation: ${fadeOut} 0.315s;
    `}
`;

const Title = styled.div`
  font-size: 27px;
  font-weight: 800;
`;

const Input = styled.input`
  width: 100%;
  height: 50px;
  border: 1px solid #fffb;
  border-radius: 10px;
  font-size: 18px;
  padding: 15px;
  background-color: transparent;
  color: #fff;
  transition: 0.3s;

  &:focus {
    transition: 0.3s;
    box-shadow: 0 0 0.1rem #fff, 0 0 0.1rem #fff, 0 0 0.4rem #fff, 0 0 0.4rem;
    outline: none;
  }
`;

const Button = styled.button`
  border-radius: 10px;
  padding: 10px 30px;
  margin: 15px 15px 0 15px;
  font-size: 18px;
  font-weight: 900;
  color: #e4cb58;
  border-color: #e4cb58;
  background-color: #e4cb5833;
  transition: 0.3s;
  cursor: pointer;

  &:hover {
    box-shadow: 0 0.5em 0.5em -0.4em #fff;
    transform: translateY(-3px);
  }
`;

const ModeDiv = styled.div`
  border: 1px solid #fffb;
  border-radius: 10px;
  padding: 15px 20px;
  height: 30%;
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  font-size: 18px;
`;

const RoundWrapper = styled.div`
  width: 30%;
  height: 100%;
  font-weight: 800;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #faed27cc;
`;

const RoundDiv = styled.div`
  height: 33%;
  width: 100%;
  /* display: flex; */
  /* align-items: center; */
  margin: 4px 0;
`;

const SelectionWrapper = styled.div`
  width: 70%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const SelectionDiv = styled.div`
  height: 33%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px 0;
`;

const ModeSpan = styled.span<{
  lang: string;
  keys: number;
  selected1: number;
  selected2: number;
  selected3: number;
}>`
  color: #fffb;
  transition: 0.3s;
  cursor: pointer;
  ${(p) =>
    // 라운드 확인
    p.lang === '1' &&
    // span의 고유 모드와 현재 클릭된 모드가 같으면 글자 강조
    p.keys === p.selected1 &&
    css`
      text-shadow: 0 0 1px #fff, 0 0 1px #fff, 0 0 5px #faed27, 0 0 10px #faed27, 0 0 20px #faed27;
    `}
  ${(p) =>
    p.lang === '2' &&
    p.keys === p.selected2 &&
    css`
      text-shadow: 0 0 1px #fff, 0 0 1px #fff, 0 0 5px #faed27, 0 0 10px #faed27, 0 0 20px #faed27;
    `}
    ${(p) =>
    p.lang === '3' &&
    p.keys === p.selected3 &&
    css`
      text-shadow: 0 0 1px #fff, 0 0 1px #fff, 0 0 5px #faed27, 0 0 10px #faed27, 0 0 20px #faed27;
    `}
`;

const modeName = ['노말', '블러', '회전', '축소'];
const round = [1, 2, 3];

function CreateRoomModal() {
  const myNickName = getUser().nickName;
  const { socket } = useClientSocket();
  const navigate = useNavigate();

  const setRoomInfo = useSetAtom(roomInfoAtom);
  const [open, setOpen] = useAtom(createRoomModalAtom);
  const [visible, setVisible] = useAtom(fadeOutAtom);

  const [roomName, setRoomName] = useState<string>('');
  const [gameMode, setGameMode] = useState<IGameMode>({
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
    ButtonClick3.play();
    setVisible(false);
    setTimeout(() => {
      setOpen(false);
    }, 300);
  };

  const handleMode = (e: any) => {
    ButtonClick2.play();
    const round: string = `round${e.target.lang}`;

    switch (e.target.innerText) {
      case '노말':
        setGameMode((prev) => ({ ...prev, [round]: GameMode.NORMAL }));
        break;
      case '블러':
        setGameMode((prev) => ({ ...prev, [round]: GameMode.BLUR }));
        break;
      case '회전':
        setGameMode((prev) => ({ ...prev, [round]: GameMode.ROTATE }));
        break;
      case '축소':
        setGameMode((prev) => ({ ...prev, [round]: GameMode.SIZEDOWN }));
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

  /**
   * keys={key2} : span 본인이 무슨 게임 모드인지
   * lang={val.toString()} : 몇 라운드의 span인지
   * selected1={r1} : clickedMode()에서 클릭된 span의 라운드를 확인하여
   * selected2={r2} : 라운드별 선택된 모드의 state를 변경하여 props로 넘겨주어
   * selected3={r3} : styled component에서 강조할 span 구분하여 css 적용
   */

  return (
    <>
      {open && <ModalBackground isOpened={open} onClick={lazyClose} isVisible={visible} />}
      <Modal isOpened={open} isVisible={visible}>
        <Title style={{ color: '#faed27' }}>방만들기</Title>
        <Input
          type="text"
          placeholder="방제목을 입력하세요"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setRoomName(e.target.value);
          }}
          value={roomName}
        />
        <Title style={{ color: '#fffd', fontSize: '24px', marginTop: '15px' }}>게임모드 선택</Title>
        <ModeDiv>
          <RoundWrapper>
            {round.map((val, key) => (
              <RoundDiv key={key}>ROUND {val}</RoundDiv>
            ))}
          </RoundWrapper>
          <SelectionWrapper>
            {round.map((val, key) => (
              <SelectionDiv key={key}>
                {modeName.map((val2, key2) => (
                  <div key={key2}>
                    <ModeSpan
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
                    </ModeSpan>
                    {key2 < 3 && (
                      <span style={{ fontSize: '12px', color: '#fff8', margin: '12px' }}>|</span>
                    )}
                  </div>
                ))}
              </SelectionDiv>
            ))}
          </SelectionWrapper>
        </ModeDiv>
        <div>
          <Button onClick={handleOk}>생성</Button>
          <Button onClick={lazyClose}>취소</Button>
        </div>
      </Modal>
    </>
  );
}

export default CreateRoomModal;
