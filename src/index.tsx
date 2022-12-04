import { StrictMode } from 'react';
import ReacCellOM from 'react-dom/client';
import App from './App';
import './style.css';
import { Provider } from "react-redux";
import store from "./Redux/store";

//@ts-ignore
const root = ReacCellOM.createRoot(document.getElementById('root'));

root.render(
    <Provider store={store}>
      <App />
    </Provider>
);