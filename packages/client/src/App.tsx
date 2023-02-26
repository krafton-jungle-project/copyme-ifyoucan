import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lobby from './pages/Lobby';
import Room from './pages/Room';
import Login from './pages/Login';
import * as Jotai from 'jotai';
import { ClientSocketContextProvider } from './module/client-socket';
import PrivateRoute from './utils/PrivateRouter';
import Login2 from './pages/Login2';
import styled from 'styled-components';

const Div = styled.div`
  /* display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%; */
`;

function App() {
  return (
    <Jotai.Provider>
      <BrowserRouter>
        <ClientSocketContextProvider>
          <Div className="App">
            <Routes>
              {/* 인증을 반드시 해야지만 접속 가능한 페이지 정의 */}
              {/* <Route element={<PrivateRoute authentication={true} />}> */}
              <Route path="/" element={<Lobby />} />
              {/* </Route> */}
              {/* 인증을 반드시 하지 않아야만 접속 가능한 페이지 정의 */}
              {/* <Route element={<PrivateRoute authentication={false} />}> */}
              <Route path="/login" element={<Login2 />} />
              {/* </Route> */}
              {/* 인증을 반드시 해야지만 접속 가능한 페이지 정의 */}
              {/* <Route element={<PrivateRoute authentication={true} />}> */}
              <Route path="/room" element={<Room />} />
              {/* </Route> */}
            </Routes>
          </Div>
        </ClientSocketContextProvider>
      </BrowserRouter>
    </Jotai.Provider>
  );
}

export default App;
