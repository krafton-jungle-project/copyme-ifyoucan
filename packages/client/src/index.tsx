import ReactDOM from 'react-dom/client';
import App from './App';
import * as Redux from 'react-redux';
import * as Jotai from 'jotai';
import { store } from './app/store';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  // <React.StrictMode>
  <Jotai.Provider>
    <Redux.Provider store={store}>
      <App />
    </Redux.Provider>
  </Jotai.Provider>,
  // </React.StrictMode>
);
