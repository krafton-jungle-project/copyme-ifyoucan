import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lobby from './pages/Lobby';
import Room from './pages/Room';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
// !
import * as Jotai from 'jotai';
import { ClientSocketContextProvider } from './module/client-socket';
import PrivateRoute from './utils/PrivateRouter';

function App() {
  return (
    <Jotai.Provider>
      <BrowserRouter>
        <ClientSocketContextProvider>
          <div className="App">
            <Routes>
              {/* 인증을 반드시 해야지만 접속 가능한 페이지 정의 */}
              <Route element={<PrivateRoute authentication={true} />}>
                <Route path="/" element={<Lobby />} />
              </Route>
              {/* 인증을 반드시 하지 않아야만 접속 가능한 페이지 정의 */}
              <Route element={<PrivateRoute authentication={false} />}>
                <Route path="/login" element={<Login />} />
              </Route>
              {/* 인증을 반드시 해야지만 접속 가능한 페이지 정의 */}
              <Route element={<PrivateRoute authentication={true} />}>
                <Route path="/room" element={<Room />} />
              </Route>
            </Routes>
          </div>
        </ClientSocketContextProvider>
      </BrowserRouter>
    </Jotai.Provider>
  );
}

export default App;
