import Announcer from './Announcer';
import MyVideo from './MyVideo';
import MyCanvas from './MyCanvas';
import PeerVideo from './PeerVideo';
import PeerCanvas from './PeerCanvas';

function InGame() {
  return (
    <>
      <MyVideo />
      <MyCanvas />
      <PeerVideo />
      <PeerCanvas />
      <Announcer />
    </>
  );
}

export default InGame;
