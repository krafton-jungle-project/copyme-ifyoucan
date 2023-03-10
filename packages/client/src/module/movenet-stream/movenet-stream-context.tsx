import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import * as movenet from '../../utils/tfjs-movenet';

type InitializeState = 'ready' | 'loading' | 'success' | 'error';
type MovenetInstance = Pick<typeof movenet, 'stream' | 'detector'>;

interface MovenetStreamContextProps {
  state: InitializeState;
  isStreamReady: boolean;
  initialize: () => Promise<void>;
  movenet: MovenetInstance;
}

const movenetStreamContext = createContext<MovenetStreamContextProps | null>(null);

interface MovenetStreamContextProviderProps {
  children: ReactNode;
}

const MovenetStreamContextProvider = ({ children }: MovenetStreamContextProviderProps) => {
  const [state, setStreamReady] = useState<InitializeState>('ready');

  const initialize = useCallback(async () => {
    // Login하여 처음 Lobby로 이동 시, stream 및 detector를 초기화
    const stream = await movenet.getMyStream({ width: 640, height: 480 });
    console.log('webcam stream is ready. (1/2)');

    const detector = await movenet.createDetector();
    console.log('pose detector is ready. (2/2)');

    if (stream && detector) {
      setStreamReady('success');
      console.log('✅ stream & detector is reloaded.');
    } else {
      setStreamReady('error');
      console.error('error: stream & detector is reloaded.');
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const isStreamReady = state === 'success';

  return (
    <movenetStreamContext.Provider
      value={{
        state,
        isStreamReady,
        movenet: { stream: movenet.stream, detector: movenet.detector },
        initialize,
      }}
    >
      {children}
    </movenetStreamContext.Provider>
  );
};

const useMovenetStream = () => {
  const ctx = useContext(movenetStreamContext);
  if (!ctx) {
    throw new Error('movenetStream is not initialized');
  }
  return ctx;
};

export { MovenetStreamContextProvider, useMovenetStream };
