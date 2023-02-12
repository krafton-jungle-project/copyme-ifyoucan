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
import { Server, Socket } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

@WebSocketGateway(8080, {
  cors: {
    origin: 'http://localhost:3000',
    // origin: '*',
    // origin: 'https://82f4-175-126-107-17.jp.ngrok.io',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  private logger = new Logger('Gateway');
  // private rooms = new Map<string, { nickName: string; id: string }[]>();
  private rooms: {
    [key: string]: {
      roomName: string;
      users: { id: string; nickName: string }[];
      started: boolean;
      readyCount: number;
    };
  } = {};

  private userToRoom: { [key: string]: string } = {};

  @WebSocketServer()
  server: Server;

  //!소켓 연결
  handleConnection(@ConnectedSocket() socket: Socket): void {
    this.logger.log(`socketId: ${socket.id} 소켓 연결`);
  }

  //!소켓 연결 해제
  handleDisconnect(@ConnectedSocket() socket: Socket): void {
    const roomId = this.userToRoom[socket.id];
    if (!roomId) return;

    // 유저 정보 업데이트
    // const users = this.rooms[roomId].users;
    console.log(this.rooms[roomId].users);
    this.rooms[roomId].users = this.rooms[roomId].users.filter(
      (user) => user.id !== socket.id,
    );
    console.log(this.rooms[roomId].users);
    if (this.rooms[roomId].users.length === 0) {
      // 방 삭제
      delete this.rooms[roomId];
      this.logger.log(`roomId: ${roomId} 삭제`);
    } else {
      socket.to(roomId).emit('user_exit', socket.id);
    }
    // console.log(this.rooms[roomId].users);
    // this.server.sockets.to(socket.id).emit('get_rooms', this.rooms);
    this.server.sockets.emit('get_rooms', this.rooms);
    this.logger.log(`socketId: ${socket.id} 소켓 연결 해제 ❌`);
  }

  //! 방 조회
  @SubscribeMessage('rooms')
  getRooms(@ConnectedSocket() socket: Socket): void {
    console.log(this.rooms);
    this.server.sockets.to(socket.id).emit('get_rooms', this.rooms);
  }

  //! 방 생성
  @SubscribeMessage('create_room')
  createRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() roomName: string,
  ): void {
    const roomId = uuidv4();
    this.rooms[roomId] = {
      roomName,
      users: [],
      started: false,
      readyCount: 0,
    };
    this.server.sockets.emit('get_rooms', this.rooms);
    this.server.sockets.to(socket.id).emit('new_room', roomId);

    this.logger.log(`create room roomname: ${roomName} by user:${socket.id} `);
  }

  //! 방에 새로운 유저 join
  @SubscribeMessage('join_room')
  joinRoom(
    @ConnectedSocket() socket: Socket,
    @MessageBody() data: { roomId: string; nickName: string },
  ): void {
    const { roomId, nickName } = data;

    // 방 정보 업데이트
    if (this.rooms[roomId]) {
      const countUsers = this.rooms[roomId].users.length;
      if (countUsers === 4) {
        //# 에러 방출?
        this.server.sockets.to(socket.id).emit('full');
        this.logger.log(`full users ${countUsers}`);
        return;
      } else {
        this.rooms[roomId].users.push({ id: socket.id, nickName });
      }
    }
    this.userToRoom[socket.id] = roomId;

    // 방에 연결
    socket.join(roomId);

    console.log(this.rooms);
    // 유저에게 이미 방에 있는 다른 유저 정보 주기
    // if ()
    const otherUsers = this.rooms[roomId].users.filter(
      (user) => user.id !== socket.id,
    );
    console.log(otherUsers);

    this.server.sockets.to(socket.id).emit('other_users', otherUsers);

    this.logger.log(
      `nickName: ${nickName}, userId: ${socket.id}, join_room : ${roomId}`,
    );
  }

  @SubscribeMessage('offer')
  offer(@ConnectedSocket() socket: Socket, @MessageBody() data: any): void {
    socket.to(data.offerReceiveID).emit('get_offer', {
      sdp: data.sdp,
      offerSendID: data.offerSendID,
      offerSendNickName: data.offerSendNickName,
    });
    this.logger.log(`offer from ${data.offerSendID} to ${data.offerReceiveID}`);
  }

  @SubscribeMessage('answer')
  answer(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    socket.to(data.answerReceiveID).emit('get_answer', {
      sdp: data.sdp,
      answerSendID: data.answerSendID,
    });
    this.logger.log(
      `answer from ${data.answerSendID} to ${data.answerReceiveID}`,
    );
  }

  @SubscribeMessage('ice')
  ice(@ConnectedSocket() socket: Socket, @MessageBody() data: any) {
    socket.to(data.candidateReceiveID).emit('get_ice', {
      candidate: data.candidate,
      candidateSendID: data.candidateSendID,
    });
    this.logger.log(
      `ice from ${data.candidateSendID} to ${data.candidateReceiveID}`,
    );
  }
}
