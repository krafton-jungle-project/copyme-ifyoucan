import { useAtomValue } from 'jotai';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { gameAtom } from '../../../app/game';
import loserEffectImg from '../../../assets/images/in-game/loser-effect.gif';
import DefaultProfileImg from '../../../assets/images/in-game/my-default-profile.png';
import winnerEffectImg from '../../../assets/images/in-game/winner-effect-me.gif';
import { stream } from '../../../utils/tfjs-movenet';

const Container = styled.div<{ isResult: boolean; isWinner: boolean }>`
  position: absolute;
  top: 50%;
  left: 0;
  transform: translate(0, -50%);
  width: 100%;
  aspect-ratio: 1;
  border-radius: 20px;
  box-shadow: ${(props) =>
    props.isResult ? 'none' : '0 0 0.2rem #fff, 0 0 0.2rem #fff, 0 0 2rem #ff3131'};
  filter: ${(props) => (props.isResult && !props.isWinner ? 'grayscale(100%)' : 'none')};
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

function MyVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const game = useAtomValue(gameAtom);

  useEffect(() => {
    if (videoRef.current) videoRef.current.srcObject = stream;
  }, []);

  return (
    <Container isResult={game.isResult} isWinner={game.user.point >= game.peer.point}>
      <Img alt="defalut profile" src={DefaultProfileImg} />
      <Video ref={videoRef} autoPlay></Video>
      {game.isResult ? (
        <ResultEffect
          alt="result effect"
          src={game.user.point >= game.peer.point ? winnerEffectImg : loserEffectImg}
        />
      ) : null}
    </Container>
  );
}

export default MyVideo;
