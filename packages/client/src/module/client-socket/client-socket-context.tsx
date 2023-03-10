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
      console.info('[π] ν΄λΌμ΄μΈνΈμ μμΌμ΄ μ°κ²°λμμ΄μ.');
    });

    return () => {
      socket.disconnect();
      console.info('[π] ν΄λΌμ΄μΈνΈμ μμΌμ΄ λμ΄μ‘μ΄μ.');
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
