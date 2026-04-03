import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
{%- if cookiecutter.use_sentry == 'y' %}
import * as Sentry from "@sentry/browser";
{%- endif %}
import App from './App';
import reportWebVitals from './reportWebVitals';

{%- if cookiecutter.use_sentry == 'y' %}

const sentryDsn = process.env.REACT_APP_SENTRY_DSN;
if (sentryDsn) {
  Sentry.init({
    dsn: sentryDsn,
    environment: process.env.REACT_APP_ENV || 'production',
  });
}
{%- endif %}

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
