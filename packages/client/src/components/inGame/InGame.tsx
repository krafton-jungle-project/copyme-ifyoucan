import Announcer from './Announcer';
import MyVideo from './MyVideo';
import MyCanvas from './MyCanvas';
import PeerVideo from './PeerVideo';
import PeerCanvas from './PeerCanvas';
import MyScoreBar from './MyScoreBar';
import PeerScoreBar from './PeerScoreBar';
import ReadyButton from './ReadyButton';
import { useAtomValue } from 'jotai';
import { hostAtom } from '../../app/atom';
import StartButton from './StartButton';

function InGame() {
  const host = useAtomValue(hostAtom);

  return (
    <>
      <Announcer />
      <MyVideo />
      <MyCanvas />
      <MyScoreBar />
      <PeerVideo />
      <PeerCanvas />
      <PeerScoreBar />
      {host ? <StartButton /> : <ReadyButton />}
    </>
  );
}

export default InGame;
