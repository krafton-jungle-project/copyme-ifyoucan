import { useAtom, useAtomValue } from 'jotai';
import React, { useEffect, useState } from 'react';
import { hostAtom } from '../../app/atom';
import { stageAtom } from './InGame';
import { useInterval } from './useInterval';

function Message() {
  const [stage, setStage] = useAtom(stageAtom);
  const host = useAtomValue(hostAtom);
  let message: string = '';

  let t: number = 0;
  let delay = 1000;

  if (stage === 0) t = 8;
  else if (stage === 2) t = 4;
  else if (stage === 4) t = 8;
  else {
    t = 0;
  }

  const [time, setTime] = useState<number>(t);

  if (stage === 0) {
    if (!host) {
      if (8 >= time && time > 6) {
        message = '게임을 시작합니다';
      } else if (6 >= time && time > 4) {
        message = '자리에서 일어나 준비해주세요';
      } else if (4 >= time && time > 2) {
        message = '잠시 후 공격이 시작됩니다';
      } else if (2 >= time && time > 0) {
        message = '공격자는 정태욱님 입니다.';
      }
    } else {
      //todo 방장일 때 떠야할 메시지
      if (8 >= time && time > 4) {
        message = '당신은 공격자 입니다';
      } else if (4 >= time && time > 0) {
        message = '잠시 후 자신만의 자세를 취해보세요';
      }
    }
  } else if (stage === 2) {
    if (!host) {
      if (4 >= time && time > 2) {
        message = '정태욱님의 자세를 따라하세요';
      } else {
        message = '따라할 수 있다면요?';
      }
    } else {
      //todo 방장일 때 떠야할 메시지

      message = '수비자들을 구경합시다!';
    }
  }

  useEffect(() => {
    if (time === 0) {
      delay = 0;
      setStage(stage + 1);
    }
  }, [time]);

  useInterval(() => {
    setTime(time - 1);
  }, delay);

  return <>{message}</>;
}

export default Message;
