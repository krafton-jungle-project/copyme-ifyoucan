import { useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Socket } from 'socket.io-client';

import { stream } from '../utils/tfjs-movenet';
import { useDispatch } from 'react-redux';
import { addUser, deleteUser } from '../modules/user';
import { useSelector } from 'react-redux';
import { RootState } from '../app/store';

//! 스턴 서버 직접 생성 고려(임시)
const pc_config = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
};

interface WebRTCProps {
  socket: Socket;
  roomId: string;
  nickName: string;
}

//todo 주소로 직접 접근 시 홈(로그인)/로비 페이지로 redirect
const WebRTC = ({ socket, roomId, nickName }: WebRTCProps) => {
  //todo useRef를 써야할까? 일반 변수로 바꿔서 테스트 및 Ref로 해야한다면 왜 그런지 알아보자

  const pcsRef = useRef<{ [socketId: string]: RTCPeerConnection }>({}); // 상대 유저의 RTCPeerConnection 저장
  const myStreamRef = useRef<MediaStream>(); // 유저 자신의 스트림 ref
  const otherUsers = useSelector((state: RootState) => state.users);

  const dispatch = useDispatch();
  const navigator = useNavigate();

  // 인자로 받은 유저와 peerConnection을 생성하는 함수
  const makeConnection = useCallback((userId: string, nickName: string) => {
    const peerConnection = new RTCPeerConnection(pc_config);

    peerConnection.addEventListener('icecandidate', (data) => {
      console.log('icecandidate event');
      if (data.candidate && socket) {
        socket.emit('ice', {
          candidate: data.candidate,
          candidateSendID: socket.id,
          candidateReceiveID: userId,
        });
      } else return;
    });

    //! 수정해야될 부분 dispatch
    peerConnection.addEventListener('track', (data) => {
      dispatch(addUser({ socketId: userId, nickName, stream: data.streams[0] }));
    });

    if (myStreamRef.current) {
      console.log('my stream added');
      myStreamRef.current.getTracks().forEach((track) => {
        if (!myStreamRef.current) return;
        peerConnection.addTrack(track, myStreamRef.current); // 내 스트림을 보내준다.
      });
    } else {
      console.log('my stream error');
    }
    return peerConnection;
  }, []);

  useEffect(() => {
    if (!roomId || !nickName || !socket) {
      console.log('방 정보 없음');
      navigator('/');
    }

    //! 유저 자신 비디오 스트림 얻기
    myStreamRef.current = stream;

    //! socket join
    socket.emit('join_room', {
      roomId,
      nickName,
    });

    //! 서버에서 다른 유저들의 정보를 받는다
    socket.on('other_users', (otherUsers: Array<{ id: string; nickName: string }>) => {
      console.log(otherUsers);
      otherUsers.forEach(async (user) => {
        // if (!myStreamRef.current) return;
        const peerConnection = makeConnection(user.id, user.nickName);
        if (!peerConnection || !socket) return;
        pcsRef.current = { ...pcsRef.current, [user.id]: peerConnection };

        try {
          const offer = await peerConnection.createOffer();
          peerConnection.setLocalDescription(new RTCSessionDescription(offer));
          socket.emit('offer', {
            sdp: offer,
            offerSendID: socket.id,
            offerSendNickName: nickName,
            offerReceiveID: user.id,
          });
        } catch (e) {
          console.log(e);
        }
      });
    });

    //! offer를 받은 유저는 answer를 보낸다
    socket.on(
      'get_offer',
      async (data: {
        sdp: RTCSessionDescription;
        offerSendID: string;
        offerSendNickName: string;
      }) => {
        const { sdp, offerSendID, offerSendNickName } = data;
        if (!myStreamRef.current) return;

        const peerConnection = makeConnection(offerSendID, offerSendNickName);

        if (!(peerConnection && socket)) return;
        pcsRef.current = { ...pcsRef.current, [offerSendID]: peerConnection };

        try {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp));
          console.log('answer set remote description success');
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(new RTCSessionDescription(answer));
          socket.emit('answer', {
            sdp: answer,
            answerSendID: socket.id,
            answerReceiveID: offerSendID,
          });
        } catch (e) {
          console.error(e);
        }
      },
    );

    //! answer에 대한 RTCSessionDescription을 얻는다.
    socket.on('get_answer', (data: { sdp: RTCSessionDescription; answerSendID: string }) => {
      const { sdp, answerSendID } = data;
      pcsRef.current[answerSendID].setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on(
      'get_ice',
      async (data: { candidate: RTCIceCandidateInit; candidateSendID: string }) => {
        try {
          const { candidate, candidateSendID } = data;
          await pcsRef.current[candidateSendID].addIceCandidate(new RTCIceCandidate(candidate));
          console.log('candidate add success');
        } catch (e) {
          console.log(e);
        }
      },
    );

    //! 유저가 나갔을 시
    socket.on('user_exit', (userId) => {
      if (!pcsRef.current[userId]) return;
      pcsRef.current[userId].close();
      delete pcsRef.current[userId];
      dispatch(deleteUser(userId));
    });

    return () => {
      if (socket) {
        socket.disconnect();
      }
      otherUsers.forEach((user) => {
        if (!pcsRef.current[user.socketId]) return;
        // closes the current peer connection
        pcsRef.current[user.socketId].close();
        // pcsRef에서 user 삭제
        delete pcsRef.current[user.socketId];
      });
      navigator('/');
    };
  }, [makeConnection]);

  return <></>;
};
export default WebRTC;
