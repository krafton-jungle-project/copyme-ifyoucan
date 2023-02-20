import Announcer from './Announcer';
import MyVideo from './MyVideo';
import PeerVideo from './PeerVideo';
import ReadyButton from './ReadyButton';
import { useAtomValue, useSetAtom } from 'jotai';
import { hostAtom } from '../../app/atom';
import StartButton from './StartButton';
import { gameAtom } from '../../app/game';
import { useEffect } from 'react';
import HardPoses from './HardPoses';
import GameBox from './GameBox';
import Chat from './waiting/Chat';

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
      <PeerVideo />
      {/* <Chat /> */}
      {host ? <StartButton /> : <ReadyButton />}
      <GameBox />
      <HardPoses />
    </>
  );
}

export default InGame;
