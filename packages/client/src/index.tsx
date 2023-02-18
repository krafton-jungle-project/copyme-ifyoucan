import ReactDOM from 'react-dom/client';
import App from './App';
import * as Jotai from 'jotai';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  // <React.StrictMode>
  <Jotai.Provider>
    <App />
  </Jotai.Provider>,
  // </React.StrictMode>
);
