import * as moveNet from '../../../utils/tfjs-movenet';
import { useClientSocket } from '../../../module/client-socket';
import { isLeftHandUp, isValidBody } from '../../common/PoseRecognition';
import { atom, useAtom, useAtomValue } from 'jotai';
import { useInterval } from '../hooks/useInterval';
import { GunReload } from '../../../utils/sound';
import { gameAtom } from '../../../app/game';
import { useEffect, useState } from 'react';
import { roomInfoAtom } from '../../../app/room';
import { peerInfoAtom } from '../../../app/peer';

//todo: 한 곳에 모으기 -> 튜토리얼과 함께 생각
export const imValidBodyAtom = atom<boolean>(false);
imValidBodyAtom.onMount = (setAtom) => {
  setAtom(false);
};

//todo
function MotionReady() {
  const { socket } = useClientSocket();
  const [game, setGame] = useAtom(gameAtom);
  const { roomId, host } = useAtomValue(roomInfoAtom);
  const peerInfo = useAtomValue(peerInfoAtom);
  const [imValidBody, setImValidBody] = useAtom(imValidBodyAtom);
  const [motionReadyDelay, setMotionReadyDelay] = useState<number | null>(null);

  //todo
  useEffect(() => {
    if (!game.isStart) {
      setMotionReadyDelay(1000);
    } else {
      setMotionReadyDelay(null);
    }
  }, [game.isStart]);

  //todo
  useInterval(async () => {
    // peer가 있다면
    if (peerInfo.socketId) {
      let poses = await moveNet.detector.estimatePoses(moveNet.myCamera.video);
      if (poses && poses.length > 0) {
        let pose = poses[0];
        // 전신이 나오지 않았는지 확인한다(최초 한 번)
        if (!imValidBody) {
          setImValidBody(isValidBody(pose));
        }
        // 최초 한 번 전신 확인을 했으면
        else {
          // 내가 host면
          if (host) {
            // 상대가 레디했을 때, 왼손을 올리면 바로 게임을 시작한다
            if (game.peer.isReady && isLeftHandUp(pose, 50)) {
              socket.emit('start', roomId);
              console.log('start');
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
                console.log('ready!');
                setGame((prev) => ({ ...prev, user: { ...prev.user, isReady: true } }));
              }
            }
            // 레디 상태일 때
            else {
              // 왼손을 내리면 레디를 푼다
              if (!isLeftHandUp(pose, 50)) {
                GunReload.play();
                socket.emit('unready', roomId);
                console.log('unready!');
                setGame((prev) => ({ ...prev, user: { ...prev.user, isReady: false } }));
              }
            }
          }
        }
      }
    }
  }, motionReadyDelay);
}

export default MotionReady;