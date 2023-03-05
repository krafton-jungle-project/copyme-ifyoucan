import classNames from 'classnames';
import { useAtomValue } from 'jotai';
import type { ChangeEvent, FormEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import { gameAtom } from '../../../app/game';
import { useClientSocket } from '../../../module/client-socket';

const Container = styled.div<{ isStart: boolean }>`
  position: absolute;
  top: ${(props) => (props.isStart ? '150%' : '50%')};
  left: 50%;
  transform: translate(-50%, -50%);
  width: 38%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 1rem;
  box-shadow: 0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #fff;
  transition: 0.5s;
  transition-delay: ${(props) => (props.isStart ? 'none' : '0.5s')};
`;

const ChatWrapper = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: 2.5%;
  width: 100%;
  height: 85%;
  padding: 0 2.5%;
  overflow: auto;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const MessageBox = styled.div`
  display: flex;
  flex-direction: column;
  &.my_message {
    align-self: flex-start;
    .message {
      align-self: flex-start;
      text-shadow: 0 0 5px #ff3131, 0 0 10px #ff3131;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 0px 20px 20px 20px;
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
  &.peer_message {
    align-self: flex-end;
    .message {
      align-self: flex-end;
      text-shadow: 0 0 5px #1f51ff, 0 0 10px #1f51ff;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 20px 0px 20px 20px;
      background-color: rgba(255, 255, 255, 0.05);
    }
  }
  &.alarm {
    align-self: center;
    .message {
      align-self: center;
      text-shadow: 0 0 5px #fff;
      border: 0;
      border-radius: 0;
      background-color: rgba(255, 255, 255, 0);
      text-overflow: ellipsis;
      white-space: nowrap;
      margin: 20px 0;
    }
  }
`;

const Message = styled.div<{ isImg: boolean }>`
  width: ${(props) => (props.isImg ? '60%' : 'fit-content')};
  padding: ${(props) => (props.isImg ? '6px 6px 0px 6px' : '10px')};
  font-size: 150%;
  font-weight: 400;
  margin-bottom: 1rem;
`;

const ImgTag = styled.img`
  transform: scaleX(-1);
  width: 100%;
  aspect-ratio: 1;
  border-radius: 20px;
  box-shadow: 0 0 0.1rem #fff, 0 0 0.1rem #fff, 0 0 0.5rem #fff;
`;

const FormWrapper = styled.div`
  position: absolute;
  left: 2%;
  width: 96%;
  height: 10%;
  bottom: 0;
  border-top: 2px solid rgba(255, 255, 255, 0.5);
`;

const MessageForm = styled.form`
  position: absolute;
  display: flex;
  top: 50%;
  transform: translate(0%, -50%);
  width: 100%;
  height: 80%;
  font-size: 150%;
  padding: 0 0.5rem 0 0.5rem;

  input {
    background-color: transparent;
    color: white;
    text-shadow: 0 0 1px #fff;
    flex-grow: 1;
    border: 0px;
    outline: none;
  }

  button {
    background-color: transparent;
    color: white;
    border: 0px;
  }
`;

export interface IChat {
  userId: string;
  message: string;
  isImg: boolean;
}

const Chat = () => {
  const [chats, setChats] = useState<IChat[]>([]);
  const [message, setMessage] = useState<string>('');
  const chatWrapperRef = useRef<HTMLDivElement>(null);
  const { socket } = useClientSocket();
  const isStart = useAtomValue(gameAtom).isStart;

  const scrollDown = () => {
    if (!chatWrapperRef.current) return;
    const chatWrapper = chatWrapperRef.current;
    const { scrollHeight, clientHeight } = chatWrapper;
    if (scrollHeight > clientHeight) {
      chatWrapper.scrollTo({ behavior: 'smooth', left: 0, top: scrollHeight });
    }
  };

  // 채팅이 길어지면(chats.length) 스크롤이 생성되므로, 스크롤의 위치를 최근 메시지에 위치시키기 위함
  useEffect(() => {
    const lastIdx = chats.length - 1;
    if (lastIdx >= 0 && !chats[lastIdx].isImg) {
      scrollDown();
    }
  }, [chats.length]);

  // message event listener
  useEffect(() => {
    const messageHandler = (chat: IChat) => {
      setChats((prevChats) => [...prevChats, chat]);
    };
    socket.on('message', messageHandler);
    return () => {
      socket.off('message', messageHandler);
    };
  }, []);

  const onChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  }, []);

  const onSendMessage = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (!message) return;

      socket.emit('message', message, (chat: IChat) => {
        setChats((prevChats) => [...prevChats, chat]);
        setMessage('');
      });
    },
    [message],
  );

  return (
    <Container isStart={isStart}>
      <ChatWrapper ref={chatWrapperRef}>
        {chats.map((chat, index) => {
          return (
            <MessageBox
              key={index}
              className={classNames({
                my_message: socket.id === chat.userId,
                peer_message: socket.id !== chat.userId,
                alarm: !chat.userId,
              })}
            >
              <Message className="message" isImg={chat.isImg}>
                {chat.isImg ? (
                  <ImgTag src={chat.message} alt="결과 이미지" onLoad={() => scrollDown()} />
                ) : (
                  chat.message
                )}
              </Message>
            </MessageBox>
          );
        })}
      </ChatWrapper>
      <FormWrapper>
        <MessageForm onSubmit={onSendMessage}>
          <input type="text" onChange={onChange} value={message} placeholder="내용을 입력하세요" />
          <button>✉️</button>
        </MessageForm>
      </FormWrapper>
    </Container>
  );
};

export default Chat;
