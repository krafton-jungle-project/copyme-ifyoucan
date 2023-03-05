import { useAtom, useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gameAtom } from '../../../app/game';
import { peerInfoAtom } from '../../../app/peer';
import { exitInGameAtom, roomInfoAtom } from '../../../app/room';
import { useClientSocket } from '../../../module/client-socket';
import { myNickName } from '../../../pages/Lobby';
import { RoomEnter, RoomExit } from '../../../utils/sound';
import { stream } from '../../../utils/tfjs-movenet';

// 스턴 서버
const pc_config = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun3.l.google.com:19302',
        'stun:stun4.l.google.com:19302',
      ],
    },
  ],
};

const useConnectWebRTC = () => {
  const { socket } = useClientSocket();
  const navigate = useNavigate();
  const pcRef = useRef<RTCPeerConnection>(); // 상대 유저의 RTCPeerConnection 저장
  const myStreamRef = useRef<MediaStream>(); // 유저 자신의 스트림 ref
  const [roomInfo, setRoomInfo] = useAtom(roomInfoAtom);
  const setPeerInfo = useSetAtom(peerInfoAtom);
  const setExitInGame = useSetAtom(exitInGameAtom);
  const resetPeerInfo = useResetAtom(peerInfoAtom);
  const resetGame = useResetAtom(gameAtom);

  // 인자로 받은 유저와 peerConnection을 생성하는 함수
  const makeConnection = useCallback((userId: string, peerNickName: string) => {
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

    peerConnection.addEventListener('track', (data) => {
      console.log('track event');
      setPeerInfo((prev) => ({
        ...prev,
        socketId: userId,
        nickName: peerNickName,
        stream: data.streams[0],
      }));
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
    if (!roomInfo.roomId || !myNickName || !socket) {
      console.log('방 정보 없음');
      navigate('/', { replace: true });
    }

    //! 유저 자신 비디오 스트림 얻기
    myStreamRef.current = stream;

    //! socket join
    socket.emit('join_room', {
      roomId: roomInfo.roomId,
      nickName: myNickName,
    });

    //! 서버에서 다른 유저의 정보를 받는다
    socket.on('peer', async (peer: { id: string; nickName: string }) => {
      const peerConnection = makeConnection(peer.id, peer.nickName);
      if (!peerConnection || !socket) return;
      pcRef.current = peerConnection;

      try {
        const offer = await peerConnection.createOffer();
        peerConnection.setLocalDescription(offer);
        socket.emit('offer', {
          sdp: offer,
          offerSendID: socket.id,
          offerSendNickName: myNickName,
          offerReceiveID: peer.id,
        });
      } catch (e) {
        console.log(e);
      }
    });

    //! offer를 받은 유저는 answer를 보낸다
    socket.on(
      'get_offer',
      async (data: {
        sdp: RTCSessionDescription;
        offerSendID: string;
        offerSendNickName: string;
      }) => {
        RoomEnter.play(); // 상대 입장음

        const { sdp, offerSendID, offerSendNickName } = data;
        if (!myStreamRef.current) return;

        // offer를 한 user는 방장이 될 수 없다.
        const peerConnection = makeConnection(offerSendID, offerSendNickName);

        if (!(peerConnection && socket)) return;
        pcRef.current = peerConnection;

        try {
          peerConnection.setRemoteDescription(sdp);
          const answer = await peerConnection.createAnswer();
          peerConnection.setLocalDescription(answer);
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
    socket.on('get_answer', (sdp: RTCSessionDescription) => {
      if (!pcRef.current) return;
      pcRef.current.setRemoteDescription(sdp);
      console.log('answer set remote description success');
    });

    socket.on('get_ice', async (candidate: RTCIceCandidateInit) => {
      try {
        if (!pcRef.current) return;
        await pcRef.current.addIceCandidate(candidate);
        console.log('candidate add success');
      } catch (e) {
        console.log(e);
      }
    });

    //! 상대가 나갔을 시
    socket.on('user_exit', (isStart) => {
      RoomExit.play(); // 상대 퇴장음

      console.log('user_exit');

      if (!pcRef.current) return;
      pcRef.current.close();

      // 게임 중일 때 상대가 나가면, 로비로 이동한다.
      if (isStart) {
        setExitInGame(true);
        alert('상대방이 게임에서 나갔습니다');
        navigate('/', { replace: true });
      }
      // 게임 중이 아닐 땐, 내가 방장이 되고 게임 초기화
      else {
        resetPeerInfo();
        resetGame();
        setRoomInfo((prev) => ({ ...prev, host: true }));
      }
    });

    return () => {
      if (!pcRef.current) return;
      console.log('webRTC return');
      pcRef.current.close();
    };
  }, []);
};

export default useConnectWebRTC;
