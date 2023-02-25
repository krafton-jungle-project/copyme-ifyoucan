import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { gameAtom, GameStage } from '../../../app/game';

const Container = styled.div<{ visible: boolean | undefined }>`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40%;
  aspect-ratio: 1;
  border-radius: 50%;
  font-size: 12vh;
  font-weight: 400;

  border: 3px solid rgba(255, 255, 255, 0.6);
  box-shadow: 0 0 0.2rem rgba(255, 255, 255, 0.6), 0 0 0.2rem rgba(255, 255, 255, 0.6),
    0 0 2rem rgba(15, 255, 80, 0.1), 0 0 0.8rem rgba(15, 255, 80, 0.1),
    0 0 2.8rem rgba(15, 255, 80, 0.1), inset 0 0 1.3rem rgba(15, 255, 80, 0.1);

  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.8), 0 0 20px rgba(255, 255, 255, 0.8),
    0 0 50px rgba(255, 255, 255, 0.8), 0 0 42px rgba(15, 255, 80, 0.1),
    0 0 120px rgba(15, 255, 80, 0.1), 0 0 92px rgba(15, 255, 80, 0.1),
    0 0 102px rgba(15, 255, 80, 0.1), 0 0 151px rgba(15, 255, 80, 0.1);

  opacity: ${(props) => (props.visible ? 1 : 0)};
  transition: opacity 0.5s ease-in-out;
`;

function CountDown({ isMe }: { isMe: boolean }) {
  const game = useAtomValue(gameAtom);
  const [visibility, setVisibility] = useState(false);

  useEffect(() => {
    if (
      (isMe &&
        ((game.stage === GameStage.OFFEND && game.user.isOffender) ||
          (game.stage === GameStage.DEFEND && !game.user.isOffender))) ||
      (!isMe &&
        ((game.stage === GameStage.OFFEND && !game.user.isOffender) ||
          (game.stage === GameStage.DEFEND && game.user.isOffender)))
    ) {
      if (game.countDown !== 0) {
        setVisibility(true);
      } else {
        setVisibility(false);
      }
    } else {
      setVisibility(false);
    }
  }, [game.stage, game.countDown]);

  if (isMe) {
  } else {
  }

  return <Container visible={visibility ? true : undefined}>{game.countDown}</Container>;
}

export default CountDown;
