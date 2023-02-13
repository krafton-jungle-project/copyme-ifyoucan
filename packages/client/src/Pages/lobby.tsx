import Play from "../components/Play";
import logo from "../assets/logo.png";
import xownsstyle from "../css/xowns97.module.css";

export default function Lobby() {
  return (
    <div>
      <div style={xownsstyle}>
        <img src={logo} alt="logo" />
      </div>
      <hr />
      <Play />
    </div>
  );
}
