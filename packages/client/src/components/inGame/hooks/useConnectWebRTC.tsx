import { useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { stream } from '../../../utils/tfjs-movenet';
import { useAtomValue, useSetAtom } from 'jotai';
import { hostAtom, nickNameAtom, roomIdAtom } from '../../../app/atom';
import { peerAtom } from '../../../app/peer';
import { useResetAtom } from 'jotai/utils';
import { useClientSocket } from '../../../module/client-socket';

//! 스턴 서버 직접 생성 고려(임시)
const pc_config = {
  iceServers: [
    {
      urls: 'stun:stun.l.google.com:19302',
    },
  ],
};

// ! 보통 컴포넌트의 렌더주기만 이용할때는 hooks라는 패턴으로 작성합니다. 그리고 관례적으로 use로 시작합니다. (확인시 제거) - @minhoyooDEV
//todo 주소로 직접 접근 시 홈(로그인)/로비 페이지로 redirect
type UseConnectWebRTCProps = {
  roomId: string;
  nickName: string;
};
const useConnectWebRTC = ({ roomId, nickName }: UseConnectWebRTCProps) => {
  const { socket } = useClientSocket();
  //todo useRef를 써야할까? 일반 변수로 바꿔서 테스트 및 Ref로 해야한다면 왜 그런지 알아보자
  const pcRef = useRef<RTCPeerConnection>(); // 상대 유저의 RTCPeerConnection 저장
  const myStreamRef = useRef<MediaStream>(); // 유저 자신의 스트림 ref
  const setPeer = useSetAtom(peerAtom);
  const setHost = useSetAtom(hostAtom);
  const resetPeer = useResetAtom(peerAtom);
  const navigate = useNavigate();

  // 인자로 받은 유저와 peerConnection을 생성하는 함수
  const makeConnection = useCallback((userId: string, nickName: string, host: boolean) => {
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
      console.log('track event');
      setPeer((prev) => ({
        ...prev,
        socketId: userId,
        nickName: nickName,
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
    if (!roomId || !nickName || !socket) {
      console.log('방 정보 없음');
      navigate('/');
    }

    //! 유저 자신 비디오 스트림 얻기
    myStreamRef.current = stream;

    //! socket join
    socket.emit('join_room', {
      roomId,
      nickName,
    });

    //! 서버에서 다른 유저의 정보를 받는다
    socket.on('peer', async (peer: { id: string; nickName: string }) => {
      const peerConnection = makeConnection(peer.id, peer.nickName, false);
      if (!peerConnection || !socket) return;
      pcRef.current = peerConnection;

      try {
        const offer = await peerConnection.createOffer();
        peerConnection.setLocalDescription(new RTCSessionDescription(offer));
        socket.emit('offer', {
          sdp: offer,
          offerSendID: socket.id,
          offerSendNickName: nickName,
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
        const { sdp, offerSendID, offerSendNickName } = data;
        if (!myStreamRef.current) return;

        // offer를 한 user는 방장이 될 수 없다.
        const peerConnection = makeConnection(offerSendID, offerSendNickName, false);

        if (!(peerConnection && socket)) return;
        pcRef.current = peerConnection;

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
    socket.on('get_answer', (sdp: RTCSessionDescription) => {
      if (!pcRef.current) return;
      pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
    });

    socket.on('get_ice', async (candidate: RTCIceCandidateInit) => {
      try {
        if (!pcRef.current) return;
        await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        console.log('candidate add success');
      } catch (e) {
        console.log(e);
      }
    });

    //! 유저가 나갔을 시
    socket.on('user_exit', () => {
      if (!pcRef.current) return;
      pcRef.current.close();
      resetPeer();
      setHost(true); // 유저가 나가면 자신이 방장이 된다.
    });

    return () => {
      if (!pcRef.current) return;

      pcRef.current.close();
      setHost(false);
      navigate('/');
    };
  }, [makeConnection]);

  return null;
};

export default useConnectWebRTC;
