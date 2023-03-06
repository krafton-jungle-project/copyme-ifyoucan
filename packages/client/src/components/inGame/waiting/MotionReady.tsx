import { useAtom, useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { gameAtom } from '../../../app/game';
import { peerInfoAtom } from '../../../app/peer';
import { roomInfoAtom } from '../../../app/room';
import { useClientSocket } from '../../../module/client-socket';
import { GunReload } from '../../../utils/sound';
import * as movenet from '../../../utils/tfjs-movenet';
import { isLeftHandUp, isValidBody } from '../../common/PoseRecognition';
import { useInterval } from '../hooks/useInterval';

function MotionReady() {
  const { socket } = useClientSocket();
  const [game, setGame] = useAtom(gameAtom);
  const { roomId, host } = useAtomValue(roomInfoAtom);
  const peerSocketId = useAtomValue(peerInfoAtom).socketId;
  const [motionReadyDelay, setMotionReadyDelay] = useState<number | null>(null);

  useEffect(() => {
    if (!game.isStart && !game.isResult) {
      setMotionReadyDelay(1000);
    } else {
      setMotionReadyDelay(null);
    }
  }, [game.isStart, game.isResult]);

  useInterval(async () => {
    // peer가 있다면
    if (peerSocketId) {
      let poses = await movenet.detector.estimatePoses(movenet.myCamera.video);
      if (poses && poses.length > 0) {
        let pose = poses[0];
        // 전신이 나오지 않았는지 확인한다(최초 한 번)
        if (!game.user.isValidBody) {
          setGame((prev) => ({ ...prev, user: { ...prev.user, isValidBody: isValidBody(pose) } }));
        }
        // 최초 한 번 전신 확인을 했으면
        else {
          // 내가 host면
          if (host) {
            // 상대가 레디했을 때, 왼손을 올리면 바로 게임을 시작한다
            if (game.peer.isReady && isLeftHandUp(pose, 50)) {
              socket.emit('start', roomId);
            }
          }
          // 내가 host가 아니면
          else {
            // 레디 상태가 아닐 때
            if (!game.user.isReady) {
              // 왼손을 올리면 레디를 한다
              if (isLeftHandUp(pose, 50)) {
                GunReload.play();
                socket.emit('ready', roomId);
              }
            }
            // 레디 상태일 때
            else {
              // 왼손을 내리면 레디를 푼다
              if (!isLeftHandUp(pose, 50)) {
                GunReload.play();
                socket.emit('unready', roomId);
              }
            }
          }
        }
      }
    }
  }, motionReadyDelay);
}

export default MotionReady;
