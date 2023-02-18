import React, { useEffect, useRef, useState } from 'react';

/* setInterval 안에서 setState 쓰려면 setInterval 대신에 이 함수 사용 */
export function useInterval(callback: any, delay: number) {
  const savedCallback = useRef<any>();

  // Remember the latest callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== 0) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}

export function Timer(props: { sec: number }) {
  const [time, setTime] = useState<number>(props.sec);

  let delay = 1000;
  let content: number = time;

  useEffect(() => {
    if (time === 0) {
      delay = 0;
    }
  }, [time]);

  useInterval(() => {
    setTime(time - 1);
  }, delay);

  return <h2>{content}</h2>;
}
