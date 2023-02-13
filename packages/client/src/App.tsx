import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Lobby from './pages/lobby';
import Room from './pages/room';


export default function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Lobby />} />
          <Route path="/room" element={<Room />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
