import type { ReactNode } from 'react';
import { createContext, useContext, useEffect } from 'react';

import { clientSocket } from './socket-instance';

interface ClientSocketContextProps {
  socket: typeof clientSocket;
}

const socket = clientSocket;
const clientSocketContext = createContext<ClientSocketContextProps | null>(null);

interface ClientSocketContextProviderProps {
  children: ReactNode;
}
const ClientSocketContextProvider = ({ children }: ClientSocketContextProviderProps) => {
  useEffect(() => {
    socket.on('connect', () => {
      console.info('[🔌] 클라이언트의 소켓이 연결되었어요.');
    });

    return () => {
      socket.disconnect();
      console.info('[🔌] 클라이언트의 소켓이 끊어졌어요.');
    };
  }, []);

  return <clientSocketContext.Provider value={{ socket }}>{children}</clientSocketContext.Provider>;
};

const useClientSocket = () => {
  const ctx = useContext(clientSocketContext);
  if (!ctx) {
    throw new Error('clientSocket is not initialized');
  }
  return ctx;
};

export { ClientSocketContextProvider, useClientSocket };
