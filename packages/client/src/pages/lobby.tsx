import RoomList from '../components/RoomList';
import logo from '../assets/logo.png'; //temp
import xownsstyle from '../css/xowns97.module.css'; //temp
import MyVideo from '../components/MyVideo';

function Lobby() {
  return (
    <div>
      <div style={xownsstyle}>
        <img src={logo} alt="logo" />
      </div>
      <hr />
      <RoomList />
      <MyVideo />
    </div>
  );
}

export default Lobby;
