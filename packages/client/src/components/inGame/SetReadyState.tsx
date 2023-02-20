import * as movenet from '../../utils/tfjs-movenet';
import { useClientSocket } from '../../module/client-socket';
import { isLeftHandUp } from '../../utils/pose-recognition';
import { useAtom, useAtomValue } from 'jotai';
import { gameAtom, GameStatus, myPoseAtom } from '../../app/game';
import { peerAtom } from '../../app/peer';
import { useInterval } from './hooks/useInterval';
import { hostAtom, roomIdAtom } from '../../app/atom';

function SetReadyState(isReady?: boolean, setIsReady?: any) {
  const { socket } = useClientSocket();
  const roomId = useAtomValue(roomIdAtom);
  const peer = useAtomValue(peerAtom);
  const host = useAtomValue(hostAtom);
  const game = useAtomValue(gameAtom);

  useInterval(async () => {
    let poses = null;

    // WATING 일때만, 실행됨
    if (game.status === GameStatus.WAITING) {
      // peer가 있어야 레디를 하든가 말든가 시작을 하든가 말든가
      if (peer.nickName !== '' && peer.stream !== null) {
        poses = await movenet.detector.estimatePoses(movenet.myCamera.video);
        if (poses && poses.length > 0) {
          let pose = poses[0];
          let flag = 0;
          // host면
          if (host) {
            // 왼손 들면 바로 게임 시작
            if (isLeftHandUp(pose, 50)) {
              if (peer.isReady) {
                socket.emit('start', roomId);
                console.log('start');
              }
            }
          }
          // host가 아니면
          else {
            // 왼손 들면
            if (isLeftHandUp(pose, 50)) {
              if (!isReady) {
                flag = 1;
              }
            }
            // 손 내리면
            else {
              if (isReady) {
                flag = 1;
              }
            }
          }

          if (flag) {
            if (isReady) {
              socket.emit('unready', roomId);
              console.log('unready!');
              setIsReady(false);
            } else {
              socket.emit('ready', roomId);
              console.log('ready!');
              setIsReady(true);
            }
            flag = 0;
          }
        }
      }
    }
  }, 1000);
}

export default SetReadyState;
