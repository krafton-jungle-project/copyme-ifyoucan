import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lobby from './pages/lobby';
import Room from './pages/room';
import Login from './pages/login';
import SignUp from './pages/signup';

function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/room" element={<Room />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
