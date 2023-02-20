import Announcer from './Announcer';
import MyVideo from './MyVideo';
import MyCanvas from './MyCanvas';
import PeerVideo from './PeerVideo';
import PeerCanvas from './PeerCanvas';
import ReadyButton from './ReadyButton';
import { useAtomValue, useSetAtom } from 'jotai';
import { hostAtom } from '../../app/atom';
import StartButton from './StartButton';
import Versus from './Versus';
import { gameAtom } from '../../app/game';
import { useEffect } from 'react';

function InGame() {
  const host = useAtomValue(hostAtom);
  const setGame = useSetAtom(gameAtom);

  useEffect(() => {
    if (host) {
      setGame((prev) => ({ ...prev, isOffender: true }));
      console.log('여기는 한번만 실행되어야함');
    }
  }, [host, setGame]);

  return (
    <>
      <Announcer />
      <MyVideo />
      <MyCanvas />
      <PeerVideo />
      <PeerCanvas />
      <Versus />
      {host ? <StartButton /> : <ReadyButton />}
    </>
  );
}

export default InGame;
