import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { gameAtom } from '../../../app/game';
import { peerInfoAtom } from '../../../app/peer';
import loserEffectImg from '../../../assets/images/in-game/loser-effect.gif';
import DefaultProfileImg from '../../../assets/images/in-game/peer-default-profile.jpg';
import winnerEffectImg from '../../../assets/images/in-game/winner-effect-peer.gif';
import transparentImg from '../../../assets/images/transparent.png';

const Container = styled.div<{ isResult: boolean; isLoser: boolean }>`
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(0, -50%);
  width: 100%;
  aspect-ratio: 1;
  border-radius: 20px;
  box-shadow: ${(props) =>
    props.isResult ? 'none' : '0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #1f51ff'};
  filter: ${(props) => (props.isResult && props.isLoser ? 'grayscale(100%)' : 'none')};
  transition: 1s;
`;

const Img = styled.img`
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
  border-radius: 20px;
`;

const Video = styled.video`
  position: absolute;
  object-fit: cover;
  transform: scaleX(-1);
  width: 100%;
  height: 100%;
  border-radius: 20px;
  background-color: #0008;
`;

const ResultEffect = styled.img`
  position: absolute;
  object-fit: cover;
  width: 100%;
  height: 100%;
  border-radius: 20px;
`;

const PeerVideo = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerStream = useAtomValue(peerInfoAtom).stream;
  const game = useAtomValue(gameAtom);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = peerStream;
  }, [peerStream]);

  return (
    <Container isResult={game.isResult} isLoser={game.user.point > game.peer.point}>
      <Img src={DefaultProfileImg} />
      <Video ref={videoRef} autoPlay />
      {game.isResult ? (
        <ResultEffect
          alt="result effect"
          src={
            game.user.point < game.peer.point
              ? winnerEffectImg
              : game.user.point === game.peer.point
              ? transparentImg
              : loserEffectImg
          }
        />
      ) : null}
    </Container>
  );
};

export default PeerVideo;
