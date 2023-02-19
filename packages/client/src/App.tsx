import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lobby from './pages/Lobby';
import Room from './pages/Room';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
// !
import * as Jotai from 'jotai';
import { ClientSocketContextProvider } from './module/client-socket';

function App() {
  return (
    <Jotai.Provider>
      <BrowserRouter>
        <ClientSocketContextProvider>
          <div className="App">
            <Routes>
              <Route path="/" element={<Lobby />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/room" element={<Room />} />
            </Routes>
          </div>
        </ClientSocketContextProvider>
      </BrowserRouter>
    </Jotai.Provider>
  );
}

export default App;
