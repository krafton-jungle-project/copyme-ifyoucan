import * as moveNet from '../../../utils/tfjs-movenet';
import { useClientSocket } from '../../../module/client-socket';
import { isLeftHandUp } from '../../../utils/pose-recognition';
import { useAtom, useAtomValue } from 'jotai';
import { gameAtom, GameStatus } from '../../../app/game';
import { peerAtom } from '../../../app/peer';
import { useInterval } from '../hooks/useInterval';
import { imHostAtom, roomIdAtom } from '../../../app/atom';
import { gunReload } from '../../../utils/sound';
import { imReadyAtom } from './ReadyButton';

function SetReadyState() {
  const { socket } = useClientSocket();
  const roomId = useAtomValue(roomIdAtom);
  const peer = useAtomValue(peerAtom);
  const imHost = useAtomValue(imHostAtom);
  const game = useAtomValue(gameAtom);
  const [imReady, setImReady] = useAtom(imReadyAtom);

  useInterval(async () => {
    // WATING 일때만, 실행됨
    if (game.status === GameStatus.WAITING) {
      // peer가 있어야 레디를 하든가 말든가 시작을 하든가 말든가
      if (peer.nickName !== '' && peer.stream !== null) {
        let poses = await moveNet.detector.estimatePoses(moveNet.myCamera.video);
        if (poses && poses.length > 0) {
          let pose = poses[0];
          // 내가 host면
          if (imHost) {
            // 상대가 레디했을 때, 왼손 들면 바로 게임 시작
            if (peer.isReady && isLeftHandUp(pose, 50)) {
              console.log(111111111, peer.isReady, isLeftHandUp(pose, 50));
              socket.emit('start', roomId);
              console.log('start');
            }
          }
          // 내가 host가 아닐 때
          else {
            // 내가 레디 상태가 아닐 때, 왼손을 올리면 레디를 한다.
            if (!imReady && isLeftHandUp(pose, 50)) {
              gunReload.play();
              socket.emit('ready', roomId);
              console.log('ready!');
              setImReady(true);
            }
            // 내가 레디 상태일 때, 왼손을 내리면 레디를 푼다.
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
  }, 1000);
}

export default SetReadyState;
