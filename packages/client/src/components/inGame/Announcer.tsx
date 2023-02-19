import React from 'react';
import styled from 'styled-components';
import VSimg from '../../assets/images/vs.png';
import RSimg from '../../assets/images/ready-button.png';

const Div = styled.div`
  position: absolute;
  border: 5px solid green;
  top: 5%;
  left: 20%;
  width: 60%;
  height: 10%;

  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  font-weight: 800;
`;

// const PeerCanvas = styled.canvas`
//   position: absolute;
//   border: 5px solid blue;
//   top: 20%;
//   right: 7.5%;
//   width: 35%;
//   height: ${35 * (3 / 4) * (16 / 9)}%;
// `;

const VS = styled.img`
  position: absolute;
  top: 30%;
  left: 42.5%;
  width: 15%;
  height: auto;
`;

const RSButton = styled.img`
  position: absolute;
  bottom: 10%;
  left: 40%;
  width: 20%;
  height: 10%;
`;

function Announcer() {
  return (
    <>
      <Div>준비가 되었으면 왼손 올려</Div>
      {/* <PeerVideo /> */}
      <VS src={VSimg} />
      <RSButton src={RSimg} />
    </>
  );
}

export default Announcer;
