import * as moveNet from '../../../utils/tfjs-movenet';
import { useClientSocket } from '../../../module/client-socket';
import { isLeftHandUp, isValidBody } from '../../common/PoseRecognition';
import { atom, useAtom, useAtomValue } from 'jotai';
import { peerAtom } from '../../../app/peer';
import { useInterval } from '../hooks/useInterval';
import { imHostAtom, roomIdAtom } from '../../../app/atom';
import { gunReload } from '../../../utils/sound';
import { imReadyAtom } from './ReadyButton';

//todo: 한 곳에 모으기(Game Handler)
export const motionReadyDelayAtom = atom<number | null>(null);

export const imValidBodyAtom = atom<boolean>(false);

function MotionReady() {
  const { socket } = useClientSocket();
  const roomId = useAtomValue(roomIdAtom);
  const peer = useAtomValue(peerAtom);
  const imHost = useAtomValue(imHostAtom);
  const [imReady, setImReady] = useAtom(imReadyAtom);
  const motionReadyDelay = useAtomValue(motionReadyDelayAtom);
  const [imValidBody, setImValidAtom] = useAtom(imValidBodyAtom);

  useInterval(async () => {
    console.log(11111);
    // peer가 있어야 레디를 하든가 말든가 시작을 하든가 말든가
    if (peer.nickName !== '' && peer.stream !== null) {
      let poses = await moveNet.detector.estimatePoses(moveNet.myCamera.video);
      if (poses && poses.length > 0) {
        let pose = poses[0];
        // 전신이 나오지 않았는지 확인한다(최초 한 번)
        if (!imValidBody) {
          setImValidAtom(isValidBody(pose));
        }
        // 최초 한 번 전신 확인을 했으면
        else {
          // 내가 host면
          if (imHost) {
            // 상대가 레디했을 때, 왼손을 올리면 바로 게임을 시작한다
            if (peer.isReady && isLeftHandUp(pose, 50)) {
              socket.emit('start', roomId);
              console.log('start');
            }
          }
          // 내가 host가 아니면
          else {
            // 레디 상태가 아닐 때, 왼손을 올리면 레디를 한다
            if (!imReady && isLeftHandUp(pose, 50)) {
              gunReload.play();
              socket.emit('ready', roomId);
              console.log('ready!');
              setImReady(true);
            }
            // 레디 상태일 때, 왼손을 내리면 레디를 푼다
            else if (imReady && !isLeftHandUp(pose, 50)) {
              gunReload.play();
              socket.emit('unready', roomId);
              console.log('unready!');
              setImReady(false);
            }
          }
        }
      }
    }
  }, motionReadyDelay);
}

export default MotionReady;
