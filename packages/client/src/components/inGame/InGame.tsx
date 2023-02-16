import type { Socket } from 'socket.io-client';
import PeerVideo from './PeerVideo';
import styled, { css } from 'styled-components';
import MyVideo from './MyVideo';
import { useSelector } from 'react-redux';
import type { RootState } from '../../app/store';
import ConnectWebRTC from './ConnectWebRTC';
import type { WebRTCProps } from './ConnectWebRTC';
import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { initializeUser } from '../../modules/user';
import { Timer, useInterval } from './useInterval';
import { atom, useAtom } from 'jotai';

import GameSocket from './GameSocket';
import StateBox from './StateBox';
import AnnounceWrapper from './AnnounceWrapper';
import ReadyBtn from './ReadyBtn';
import ExitRoom from './ExitRoom';
import Message from './Message';

import { capturePose } from '../../utils/capture-pose';
import getPose from '../../utils/get-pose';
import { comparePoses } from '../../utils/pose-similarity';
import * as poseDetection from '@tensorflow-models/pose-detection';

const position = [
  ['left', 'top'],
  ['right', 'top'],
  ['left', 'bottom'],
  ['right', 'bottom'],
];

const UserLabel = styled.h2`
  color: blue;
`;

const VideoWrapper = styled.div`
  position: relative;
  border: 3px solid transparent;
  width: 95%;
  height: 800px;
`;

const UserWrapper = styled.div<{ ps: number }>`
  border: 3px solid black;
  border-radius: 10px;
  padding: 5px;
  padding-top: 10px;
  width: 430px;
  height: 370px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  position: absolute;
  ${(props) =>
    props.ps &&
    css`
      ${position[props.ps][0]}: ${0};
      ${position[props.ps][1]}: ${0};
    `}
`;

export const modeAtom = atom('waiting');
modeAtom.onMount = (onMountModeAtom) => {
  return () => onMountModeAtom('waiting');
};

export const stageAtom = atom(0);
stageAtom.onMount = (onMountStageAtom) => {
  return () => onMountStageAtom(0);
};

export const scoreAtom = atom<number>(0);
// stageAtom.onMount = (onMountStageAtom) => {
//   return () => onMountStageAtom(0);
// };

//todo socket, roomId, nickName 등 전역 관리 필요
function InGame({ socket, roomId, nickName }: WebRTCProps) {
  const dispatch = useDispatch();
  const otherUsers = useSelector((state: RootState) => state.users);
  const host = useSelector((state: RootState) => state.host);

  const videoRef = useRef<HTMLVideoElement>(null);
  let cnt: number = 0;

  const [score, setScore] = useAtom(scoreAtom);
  ConnectWebRTC({ socket, roomId, nickName });

  useEffect(() => {
    return () => {
      // 방에서 나갈 시 otherUser 정보 초기화
      dispatch(initializeUser());
    };
  }, []);

  const [mode, setMode] = useAtom(modeAtom);
  const [stage, setStage] = useAtom(stageAtom);

  let message: string | JSX.Element = '';

  if (mode === 'waiting') {
    if (host) {
      message = '모든 유저가 준비가 완료되면 시작해주세요';
    } else {
      message = '준비가 되었으면 READY를 눌러주세요';
    }
  } else if (mode === 'game') {
    // 게임 안내
    if (stage === 0) {
      message = <Message />;
    }
    // 공격 카운트
    else if (stage === 1) {
      message = <Timer sec={5} />;
    }
    // 수비 안내
    else if (stage === 2) {
      // 공격 이미 찍어서 보내면 자동으로 띄워짐
      if (host && videoRef.current) capturePose(videoRef.current, socket);
      message = <Message />;
    }

    // 수비 카운트
    else if (stage === 3) {
      message = <Timer sec={5} />;
    }

    // 공격자 이미지 취소되고 다시 비디오 송출
    else if (stage === 4) {
      if (host) {
        socket.emit('image_reset');
      } else {
        // getPose()
        //   .then((pose:any) => {
        //     if(pose !== undefined) {
        //       comparePoses(pose, otherUsers.find((user)=>{
        //       user.pose !== null ? user.pose : 0;
        //     }))}}).then
      }
      message = '수고하셨습니다';

      setTimeout(() => {
        setMode('waiting');
      }, 2000);
    }
  } else if (stage === 5) {
    console.log('대기실ㄱㄱ해야돼..');
  }
  //todo

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <VideoWrapper>
        <UserWrapper ps={0}>
          <MyVideo inheritRef={videoRef} />
          <StateBox></StateBox>
        </UserWrapper>
        <GameSocket socket={socket} />
        {otherUsers.map((user, index) => (
          <UserWrapper ps={index + 1}>
            <PeerVideo key={index} user={user} />
            <StateBox></StateBox>
          </UserWrapper>
        ))}
        {/* <ReadyButton socket={socket} roomId={roomId} /> */}
        <AnnounceWrapper message={message}></AnnounceWrapper>
        {mode === 'waiting' ? <ReadyBtn socket={socket} roomId={roomId}></ReadyBtn> : null}
        {mode === 'waiting' ? <ExitRoom></ExitRoom> : null}
      </VideoWrapper>
    </div>
  );
}

export default InGame;
