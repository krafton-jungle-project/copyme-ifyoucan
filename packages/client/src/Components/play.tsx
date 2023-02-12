import '../App.css';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import styled from 'styled-components';
import Poro from '../Assets/arcadePoro.png'

const SOCKET_SERVER_URL = 'http://localhost:8081';
// const SOCKET_SERVER_URL = 'https://8d4a-175-126-107-17.jp.ngrok.io';
const RoomContainer = styled.div `
  width: 950px;
  height: 530px;
  display: flex;
  justify-content: space-evenly;
  align-items: flex-start;
  border: 1px solid red;
  padding: 30px 50px;
  flex-wrap: wrap;
  overflow: scroll;
`

const RoomListContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-items: center;
  align-items: center;
`

const RoomBox = styled.div`
  width: 370px;
  height: 150px;
  margin: 5px 5px;
  border: 1px solid black;
  border-radius: 7px;
  padding: 30px 20px;
  display: flex;
`

const RoomHeader = styled.h2`
  text-align: center;
  margin-top: 20px;
`

const RoomName = styled.span`
  font-size: 23px;
  font-weight: 700;
`

const PoroImg = styled.img`
  width: 140px;
  height: 140px;
`

const RoomInfo = styled.div`
  margin-left: 10px;
  position: relative;
  width: 230px;
  height: 160px;
`

const JoinBtn = styled.button`
  position: absolute;
  width: 80px;
  height: 50px;
  font-size: 23px;
  bottom: 0;
  right: 0;
`

const RoomCnt = styled.span`
  position: absolute;
  bottom: 0;
  left: 0;
  font-size: 23px;
  font-weight: 600;
`



export default function Play() {
  const navigate = useNavigate();
  const [isloaded, setIsloaded] = useState<boolean>(false);
  // const [nickName, setNickName] = useState<string>("");
  const nickName = "user1";
  const [disable, setDisable] = useState<boolean>(false);
  const socket = io(SOCKET_SERVER_URL);

	const [rooms, setRooms] = useState<{
    [key: string]: {
      roomName: string;
      users: { id: string; nickName: string }[];
      started: boolean;
      readyCount: number;
    };
  }>({})
	const [newRoomName, setNewRoomName] = useState("");


  // 사이트에서 나가면 경고창 띄우기
  const preventClose = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = ""; // chrome에서는 return value 설정 필요
  }

  useEffect(() => {
      (() => {
        window.addEventListener("beforeunload", preventClose);
      })();

      return () => {
          window.removeEventListener("beforeunload", preventClose);
      };
  }, []);

  useEffect(() => {
    socket.emit('rooms');
    return () => {
      socket.disconnect();
    }
  }, [])

  useEffect(() => {

    socket.on('get_rooms', (rooms) => {
      setRooms(rooms)
      console.log(Object.entries(rooms))
    });
    return () => {
      socket.disconnect();
    }
  }, [rooms])

  const joinRoom = (roomId: string) => {
    console.log(roomId);
    navigate('/room', {
      state: {
        roomId: roomId,
        nickName: nickName,
      }
    });
	}



  return (
	<div className="play">
	  <form>
				방이름: <input onChange={(e)=>setNewRoomName(e.target.value)} type="text" value={newRoomName} />{" "}
			<button type="submit">
				생성
			</button>
    </form>
      <RoomHeader>방 목록</RoomHeader>
      <RoomContainer>{
        Object.entries(rooms).map((room) => {
          return (
            <RoomBox key={room[0]}>
              <div>
                <PoroImg src={Poro}  />
              </div>
              <RoomInfo>
                <RoomName>
                  <RoomCnt>{room[1].users.length} / 4</RoomCnt>
                  {room[1].roomName}
                </RoomName>
                <JoinBtn
                  onClick={() => joinRoom(room[0])}
                  disabled={room[1].users.length >= 4}
                >
                  드루와
                </JoinBtn>
              </RoomInfo>
            </RoomBox>
          )
        })
      }</RoomContainer>
      </div>
  );
}