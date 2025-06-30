import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import * as Sentry from "@sentry/browser";
import App from './App';
import reportWebVitals from './reportWebVitals';

Sentry.init({ dsn: "https://5ccfc96a09ac40259b0987f6aa6f7ba8@sentry.vsdg.ru/2" });

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
