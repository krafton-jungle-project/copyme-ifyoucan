import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import { gameAtom, GameStage } from '../../../app/game';
import { GameMode } from '../../../app/room';

const Container = styled.div<{ isMe: boolean; isOffender: boolean; gameMode: number }>`
  position: absolute;

  /* 축소 모드가 아니거나 축소 모드이더라도 공격자가 아닐 경우 */
  ${(props) =>
    (props.gameMode !== GameMode.SIZEDOWN ||
      (props.gameMode === GameMode.SIZEDOWN && !props.isOffender)) &&
    css`
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    `}

  /* 축소 모드일 때 내가 공격자인 경우 */
  ${(props) =>
    props.gameMode === GameMode.SIZEDOWN &&
    props.isMe &&
    props.isOffender &&
    css`
      top: 50%;
      left: 10%;
      transform: translate(0, -50%);
    `}

  /* 축소 모드일 때 상대가 공격자인 경우 */
  ${(props) =>
    props.gameMode === GameMode.SIZEDOWN &&
    !props.isMe &&
    props.isOffender &&
    css`
      top: 50%;
      right: 10%;
      transform: translate(0, -50%);
    `}

  font-size: 12vh;
  font-weight: 600;
  color: #fff;
  text-shadow: 0 0 20px #39ff14;

  &::after {
    content: attr(data-count);
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    color: #39ff14;
    z-index: -1;
    filter: blur(15px);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #6bf952;
    z-index: -2;
    filter: blur(20px);
    opacity: 0.2;
  }
`;

function CountDown({ isMe, gameMode }: { isMe: boolean; gameMode: number }) {
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

  return (
    <>
      {visibility && game.countDown > 0 ? (
        <Container
          data-count={String(game.countDown)}
          isMe={isMe}
          isOffender={isMe ? game.user.isOffender : !game.user.isOffender}
          gameMode={gameMode}
        >
          {game.countDown}
        </Container>
      ) : null}
    </>
  );
}

export default CountDown;
