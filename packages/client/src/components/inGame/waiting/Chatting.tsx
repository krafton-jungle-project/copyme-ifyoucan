import classNames from 'classnames';
import type { ChangeEvent, FormEvent } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled from '@emotion/styled';
import { useClientSocket } from '../../../module/client-socket';

const Container = styled.div`
  position: absolute;
  border: 5px solid yellow;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  height: 100%;
`;

const ChatContainer = styled.div`
  display: flex;
  width: 300px;
  flex-direction: column;
  border: 1px solid #000;
  padding: 1rem;

  min-height: 360px;
  max-height: 600px;
  overflow: auto;

  background: #b2c7d9;
  nav {
    float: right;
  }
`;

const MessageBox = styled.div`
  display: flex;
  flex-direction: column;

  &.my_message {
    align-self: flex-end;

    .message {
      background: yellow;
      align-self: flex-end;
    }
  }

  &.alarm {
    align-self: center;
  }
`;

const Message = styled.span`
  margin-bottom: 0.5rem;
  background: white;
  width: fit-content;
  padding: 12px;
  border-radius: 0.5rem;
  color: black;
`;

const MessageForm = styled.form`
  display: flex;
  margin-top: 24px;
  width: 500px;
  input {
    flex-grow: 1;
    margin-right: 1rem;
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
  const chatContainerEl = useRef<HTMLDivElement>(null);
  const { socket } = useClientSocket();
  const imgRef = useRef<HTMLImageElement>(null);

  // 채팅이 길어지면(chats.length) 스크롤이 생성되므로, 스크롤의 위치를 최근 메시지에 위치시키기 위함
  useEffect(() => {
    if (!chatContainerEl.current) return;

    const chatContainer = chatContainerEl.current;
    const { scrollHeight, clientHeight } = chatContainer;

    if (scrollHeight > clientHeight) {
      chatContainer.scrollTop = scrollHeight - clientHeight;
    }
  }, [chats.length]);

  // message event listener
  useEffect(() => {
    const messageHandler = (chat: IChat) => setChats((prevChats) => [...prevChats, chat]);
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
      if (!message) return alert('메시지를 입력해 주세요.');

      socket.emit('message', message, (chat: IChat) => {
        setChats((prevChats) => [...prevChats, chat]);
        setMessage('');
      });
    },
    [message],
  );

  return (
    <Container>
      <ChatContainer ref={chatContainerEl}>
        {chats.map((chat, index) => {
          if (chat.isImg && imgRef.current) {
            imgRef.current.src = chat.message;
            imgRef.current.style.width = '200px';
            imgRef.current.style.height = '200px';
          }
          return (
            <MessageBox
              key={index}
              className={classNames({
                my_message: socket.id !== chat.userId,
                alarm: !chat.userId,
              })}
            >
              {chat.isImg ? (
                <img ref={imgRef} alt="aa"></img>
              ) : (
                <Message className="message">{chat.message}</Message>
              )}
            </MessageBox>
          );
        })}
      </ChatContainer>
      <MessageForm onSubmit={onSendMessage}>
        <input type="text" onChange={onChange} value={message} />
        <button>보내기</button>
      </MessageForm>
    </Container>
  );
};

export default Chat;
