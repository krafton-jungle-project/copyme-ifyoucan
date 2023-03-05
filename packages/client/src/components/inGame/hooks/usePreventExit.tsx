import { useEffect } from 'react';

// 사이트에서 나가는 시도(새로고침, 브라우저 닫기)를 할 때 경고창 띄우기
function usePreventExit() {
  const preventDefault = (e: BeforeUnloadEvent) => {
    e.preventDefault();
    e.returnValue = ''; // chrome에서는 return value 설정 필요
  };

  useEffect(() => {
    (() => window.addEventListener('beforeunload', preventDefault))();
    return () => window.removeEventListener('beforeunload', preventDefault);
  }, []);
}

export { usePreventExit };
