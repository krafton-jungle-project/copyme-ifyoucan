import '../App.css';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import Play from '../Components/play';
import logo from '../Assets/logo.png'
import xownsstyle from '../CSS/xowns97.module.css';
;

export default function Lobby() {
  return (
    <div>
      <div id="xowns97__wrapper" style={xownsstyle}>
        <img src={logo} alt="logo" />
      </div>
      <hr />
      <Play />
      {/* <Play /> */}
    </div>
  )
}
