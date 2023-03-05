import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  ClientToServerEvents,
  IGameMode,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from 'project-types';
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';
type ServerToClientSocket = Socket<ServerToClientEvents>;

@WebSocketGateway(8081, {
  cors: {
    // origin: 'http://localhost:3000',
    origin: '*',
    // origin: 'http://6650-175-126-107-17.jp.ngrok.io',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger('Gateway');
  private rooms: {
    [key: string]: {
      roomName: string;
      users: { id: string; nickName: string }[];
      isStart: boolean;
      readyCount: number;
      images: [string, string][];
      scores: number[];
      gameMode: IGameMode;
      thumbnailIdx: number;
    };
  } = {};

  private userToRoom: { [key: string]: string } = {};

  @WebSocketServer()
  server: Server<ClientToServerEvents, InterServerEvents, ServerToClientEvents, SocketData>;

  //!소켓 연결
  handleConnection(@ConnectedSocket() socket: ServerToClientSocket): void {
    this.logger.log(`socketId: ${socket.id} 소켓 연결`);
  }

  //!소켓 연결 해제
  handleDisconnect(@ConnectedSocket() socket: ServerToClientSocket): void {
    this.logger.log(`socketId: ${socket.id} 소켓 연결 해제 ❌`);
    const roomId = this.userToRoom[socket.id];
    if (!roomId) return;
    delete this.userToRoom[socket.id];

    // 유저 정보 업데이트
    if (this.rooms[roomId]) {
      this.rooms[roomId].users = this.rooms[roomId].users.filter((user) => user.id !== socket.id);
      if (this.rooms[roomId].users.length === 0) {
        // 방 삭제
        delete this.rooms[roomId];
        this.logger.log(`roomId: ${roomId} 삭제`);
      } else {
        socket.to(roomId).emit('user_exit', this.rooms[roomId].isStart);
        socket.to(roomId).emit('message', {
          userId: '',
          message: `🔴 상대방의 연결이 끊겼습니다 🔴`,
          isImg: false,
        });
      }
    }

    // 모든 클라이언트에게 업데이트 된 방 정보 전달
    this.server.emit('get_rooms', this.rooms);
  }

  //! 방 조회
  @SubscribeMessage('rooms')
  getRooms(@ConnectedSocket() socket: ServerToClientSocket): void {
    this.server.to(socket.id).emit('get_rooms', this.rooms);
  }

  //! 방 생성
  @SubscribeMessage('create_room')
  createRoom(
    @ConnectedSocket() socket: ServerToClientSocket,
    @MessageBody()
    data: {
      roomName: string;
      gameMode: IGameMode;
      thumbnailIdx: number;
    },
  ): void {
    const roomId = uuidv4();
    this.rooms[roomId] = {
      roomName: data.roomName,
      users: [],
      isStart: false,
      readyCount: 0,
      images: [],
      scores: [],
      gameMode: data.gameMode,
      thumbnailIdx: data.thumbnailIdx,
    };

    this.server.to(socket.id).emit('new_room', roomId, data.gameMode);

    this.logger.log(`create room roomname: ${data.roomName} by user:${socket.id} `);
  }

  //! 준비
  @SubscribeMessage('ready')
  ready(@ConnectedSocket() socket: ServerToClientSocket, @MessageBody() roomId: string): void {
    this.rooms[roomId].readyCount += 1;

    this.server.in(roomId).emit('message', {
      userId: '',
      message: ' ',
      isImg: false,
    });
    this.server.in(roomId).emit('message', {
      message: `🔥 준비완료 🔥`,
      userId: '',
      isImg: false,
    });
    this.server.in(roomId).emit('message', {
      userId: '',
      message: ' ',
      isImg: false,
    });

    // 방에 모든 유저들에게 준비 했다고 알려줌
    this.server.in(roomId).emit('get_ready');
  }

  //! 준비 취소
  @SubscribeMessage('unready')
  cancelReady(
    @ConnectedSocket() socket: ServerToClientSocket,
    @MessageBody() roomId: string,
  ): void {
    this.rooms[roomId].readyCount -= 1;

    this.server.in(roomId).emit('message', {
      userId: '',
      message: ' ',
      isImg: false,
    });
    this.server.in(roomId).emit('message', {
      message: `🚧 재정비중 🚧`,
      userId: '',
      isImg: false,
    });
    this.server.in(roomId).emit('message', {
      userId: '',
      message: ' ',
      isImg: false,
    });

    // 방에 모든 유저들에게 준비 취소했다고 알려줌
    this.server.in(roomId).emit('get_unready');
  }

  //! imgae 전송(공격이 끝났을 시 이벤트를 받는다)
  @SubscribeMessage('image')
  imageHandle(
    @ConnectedSocket() socket: ServerToClientSocket,
    @MessageBody() data: [string, string],
  ): void {
    console.log('image');
    const roomId = this.userToRoom[socket.id];
    this.rooms[roomId].images.push(data);
  }

  //! score 저장
  @SubscribeMessage('round_score')
  scoreHandle(@ConnectedSocket() socket: ServerToClientSocket, @MessageBody() score: number): void {
    const roomId = this.userToRoom[socket.id];
    this.rooms[roomId].scores.push(score);
    console.log(this.rooms[roomId].scores);
  }

  //! 게임 시작
  @SubscribeMessage('start')
  gameStart(@MessageBody() roomId: string): void {
    if (!this.rooms[roomId].isStart) {
      // 게임이 시작하면 모든 유저들에게 게임이 시작됐다는 이벤트 발생
      this.rooms[roomId].isStart = true;
      this.server.in(roomId).emit('get_start');
    }
  }

  //! 카운트 다운 시작
  @SubscribeMessage('count_down')
  countDown(@ConnectedSocket() socket: ServerToClientSocket, @MessageBody() stage: string): void {
    const roomId = this.userToRoom[socket.id];
    let count = 5;
    const intervalId = setInterval(() => {
      if (count >= 0) {
        this.server.in(roomId).emit('get_count_down', count--, stage);
      } else {
        clearInterval(intervalId);
      }
    }, 1000);
  }

  //! 점수를 공격자에게 전송
  @SubscribeMessage('score')
  getScore(
    @ConnectedSocket() socket: ServerToClientSocket,
    @MessageBody() data: { defender: string; score: number },
  ): void {
    // 실시간 수비 점수 공유
    const roomId = this.userToRoom[socket.id];
    this.server.in(roomId).emit('get_score', data);
  }

  //! 라운드 승점 변경
  @SubscribeMessage('point')
  getPoint(@ConnectedSocket() socket: ServerToClientSocket, @MessageBody() winner: string): void {
    const roomId = this.userToRoom[socket.id];
    this.server.in(roomId).emit('get_point', winner);
  }

  //! 게임 끝
  @SubscribeMessage('result')
  gameResult(@ConnectedSocket() socket: ServerToClientSocket): void {
    const roomId = this.userToRoom[socket.id];
    const scores = this.rooms[roomId].scores;
    const maxScore = Math.max.apply(null, scores);
    const minScore = Math.min.apply(null, scores);
    const bestIdx = scores.indexOf(maxScore);
    const worstIdx = scores.indexOf(minScore);
    const resultImg = [];
    console.log('bestIdx', bestIdx);
    console.log('worstIdx', worstIdx);
    console.log(this.rooms[roomId].images.length);
    this.rooms[roomId].images[bestIdx].forEach((img) => resultImg.push(img));
    this.rooms[roomId].images[worstIdx].forEach((img) => resultImg.push(img));

    // 이미지 병합을 위해 결과 이미지를 클라이언트에 보낸다.
    this.server.in(roomId).emit('get_upload', resultImg);
    const users = this.rooms[roomId].users;
    let idx = 0;

    // 방에 모든 유저들에게 게임이 끝났다고 알려줌
    this.rooms[roomId].isStart = false;
    this.server.in(roomId).emit('get_result');

    const intervalId = setInterval(() => {
      if (idx <= 6) {
        if (idx === 0) {
          this.server.in(roomId).emit('message', {
            userId: '',
            message: '　',
            isImg: false,
          });
          this.server.in(roomId).emit('message', {
            userId: '',
            message: '🔥 최고의 수비 🔥',
            isImg: false,
          });
        } else if (idx === 1) {
          if (bestIdx % 2 === 0) {
            this.server.in(roomId).emit('message', {
              userId: users[0].id,
              message: '공격 포즈',
              isImg: false,
            });
            this.server.in(roomId).emit('message', {
              userId: users[0].id,
              message: resultImg[0],
              isImg: true,
            });
          } else {
            this.server.in(roomId).emit('message', {
              userId: users[1].id,
              message: '공격 포즈',
              isImg: false,
            });
            this.server.in(roomId).emit('message', {
              userId: users[1].id,
              message: resultImg[0],
              isImg: true,
            });
          }
        } else if (idx === 2) {
          if (bestIdx % 2 === 0) {
            this.server.in(roomId).emit('message', {
              userId: users[1].id,
              message: `수비 포즈(유사도 ${maxScore}%)`,
              isImg: false,
            });
            this.server.in(roomId).emit('message', {
              userId: users[1].id,
              message: resultImg[1],
              isImg: true,
            });
          } else {
            this.server.in(roomId).emit('message', {
              userId: users[0].id,
              message: `수비 포즈(유사도 ${maxScore}%)`,
              isImg: false,
            });
            this.server.in(roomId).emit('message', {
              userId: users[0].id,
              message: resultImg[1],
              isImg: true,
            });
          }
        } else if (idx === 3) {
          this.server.in(roomId).emit('message', {
            userId: '',
            message: '　',
            isImg: false,
          });
          this.server.in(roomId).emit('message', {
            userId: '',
            message: '\n\n🔥 최고의 공격 🔥',
            isImg: false,
          });
        } else if (idx === 4) {
          if (worstIdx % 2 === 0) {
            this.server.in(roomId).emit('message', {
              userId: users[0].id,
              message: '공격 포즈',
              isImg: false,
            });
            this.server.in(roomId).emit('message', {
              userId: users[0].id,
              message: resultImg[2],
              isImg: true,
            });
          } else {
            this.server.in(roomId).emit('message', {
              userId: users[1].id,
              message: '공격 포즈',
              isImg: false,
            });
            this.server.in(roomId).emit('message', {
              userId: users[1].id,
              message: resultImg[2],
              isImg: true,
            });
          }
        } else if (idx === 5) {
          if (worstIdx % 2 === 0) {
            this.server.in(roomId).emit('message', {
              userId: users[1].id,
              message: `수비 자세(유사도 ${minScore}%)`,
              isImg: false,
            });
            this.server.in(roomId).emit('message', {
              userId: users[1].id,
              message: resultImg[3],
              isImg: true,
            });
          } else {
            this.server.in(roomId).emit('message', {
              userId: users[0].id,
              message: `수비 자세(유사도 ${minScore}%)`,
              isImg: false,
            });
            this.server.in(roomId).emit('message', {
              userId: users[0].id,
              message: resultImg[3],
              isImg: true,
            });
          }
        } else {
          this.server.in(roomId).emit('message', {
            userId: '',
            message: '　',
            isImg: false,
          });
          this.server.in(roomId).emit('message', {
            userId: '',
            message: `🕹️ GAME OVER 🕹️`,
            isImg: false,
          });
          this.server.in(roomId).emit('message', {
            userId: '',
            message: '　',
            isImg: false,
          });
        }

        idx++;
      } else {
        // 모든 메세지 다 보낸 후
        clearInterval(intervalId);

        // 방에 모든 유저들에게 게임 결과 송출이 끝났다고 알려줌
        this.server.in(roomId).emit('get_finish');

        // 게임 상태 초기화
        this.rooms[roomId] = { ...this.rooms[roomId], isStart: false, images: [], scores: [] };
      }
    }, 3000);
  }

  //! 게임 종료
  @SubscribeMessage('finish')
  getFinsh(@ConnectedSocket() socket: ServerToClientSocket): void {
    // 방에 모든 유저들에게 게임 결과 송출이 끝났다고 알려줌
    const roomId = this.userToRoom[socket.id];

    this.server.to(socket.id).emit('get_finish');
    // 게임 상태 초기화
    this.rooms[roomId] = { ...this.rooms[roomId], isStart: false, images: [], scores: [] };
  }

  //! 방에 새로운 유저 join
  @SubscribeMessage('join_room')
  joinRoom(
    @ConnectedSocket() socket: ServerToClientSocket,
    @MessageBody() data: { roomId: string; nickName: string },
  ): void {
    const { roomId, nickName } = data;

    if (!this.rooms[roomId]) {
      this.server.to(socket.id).emit('error');
      return;
    }

    // 방 정보 업데이트
    this.rooms[roomId].users.push({ id: socket.id, nickName });
    this.userToRoom[socket.id] = roomId;

    // 방에 연결
    socket.join(roomId);

    // Lobby 유저에게 Room 정보 전달
    this.server.emit('get_rooms', this.rooms);

    const otherUsers = this.rooms[roomId].users.filter((user) => user.id !== socket.id);

    // 유저에게 이미 방에 있는 다른 유저 정보 주기
    if (otherUsers.length === 0) return;
    this.server.to(socket.id).emit('peer', otherUsers[0]);

    //채팅 메시지 날려보기
    this.server.in(roomId).emit('message', {
      message: `🟢 ${nickName}님이 입장했습니다 🟢`,
      userId: '',
      isImg: false,
    });

    this.logger.log(`nickName: ${nickName}, userId: ${socket.id}, join_room : ${roomId}`);
  }

  //! 방에서 유저 exit
  @SubscribeMessage('exit_room')
  exitRoom(@ConnectedSocket() socket: ServerToClientSocket, @MessageBody() nickName: string): void {
    const roomId = this.userToRoom[socket.id];
    if (!roomId) return;

    delete this.userToRoom[socket.id];
    socket.leave(roomId);

    // 유저 정보 업데이트
    if (this.rooms[roomId]) {
      this.rooms[roomId].users = this.rooms[roomId].users.filter((user) => user.id !== socket.id);
      if (this.rooms[roomId].users.length === 0) {
        // 방에 유저가 없으면 방 삭제
        delete this.rooms[roomId];
        this.logger.log(`roomId: ${roomId} 삭제`);
      } else {
        socket.to(roomId).emit('user_exit', this.rooms[roomId].isStart);
        socket.to(roomId).emit('message', {
          userId: '',
          message: `🔴 ${nickName}님이 퇴장했습니다 🔴`,
          isImg: false,
        });
      }
    }
    // 모든 클라이언트에게 업데이트 된 방 정보 전달
    this.server.emit('get_rooms', this.rooms);

    this.logger.log(`socketId: ${socket.id} exit `);
  }

  @SubscribeMessage('offer')
  offer(
    @MessageBody()
    data: {
      sdp: RTCSessionDescription;
      offerSendID: string;
      offerSendNickName: string;
      offerReceiveID: string;
    },
  ): void {
    this.server.to(data.offerReceiveID).emit('get_offer', {
      sdp: data.sdp,
      offerSendID: data.offerSendID,
      offerSendNickName: data.offerSendNickName,
    });
    this.logger.log(`offer from ${data.offerSendID} to ${data.offerReceiveID}`);
  }

  @SubscribeMessage('answer')
  answer(
    @MessageBody()
    data: {
      sdp: RTCSessionDescription;
      answerSendID: string;
      answerReceiveID: string;
    },
  ) {
    this.server.to(data.answerReceiveID).emit('get_answer', data.sdp);
    this.logger.log(`answer from ${data.answerSendID} to ${data.answerReceiveID}`);
  }

  @SubscribeMessage('ice')
  ice(
    @MessageBody()
    data: {
      candidate: RTCIceCandidate;
      candidateSendID: string;
      candidateReceiveID: string;
    },
  ) {
    this.server.to(data.candidateReceiveID).emit('get_ice', data.candidate);
    this.logger.log(`ice from ${data.candidateSendID} to ${data.candidateReceiveID}`);
  }

  @SubscribeMessage('message')
  handleMessage(@ConnectedSocket() socket: ServerToClientSocket, @MessageBody() message: string) {
    const roomId = this.userToRoom[socket.id];
    socket.to(roomId).emit('message', { userId: socket.id, message, isImg: false });
    return { userId: socket.id, message, isImg: false };
  }

  @SubscribeMessage('change_stage')
  handleGameStage(@ConnectedSocket() socket: ServerToClientSocket, @MessageBody() stage: number) {
    const roomId = this.userToRoom[socket.id];
    this.server.to(roomId).emit('get_change_stage', stage);
  }
}
