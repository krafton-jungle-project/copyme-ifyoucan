import { useState } from 'react';

function StartButton() {
  const [isReady, setIsReady] = useState(false);

  function start() {
    // socket.emit('game_start', roomId); //! 서버 쪽 코드 변경 있음
    console.log('start');
  }

  return (
    <button // 모두 레디 안되어 있으면 게임 시작 버튼 비활성화
      // disabled={!peer.isReady}
      onClick={start}
    >
      START
    </button>
  );
}

export default StartButton;
