import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AuthProvider } from "react-oidc-context";

import App from './App';
import reportWebVitals from './reportWebVitals';

var oidcConfig = {
  authority: "https://localhost:42300",
  client_id: "QuickTemplate_App",
  redirect_uri: "http://localhost:4200"
  // ...
};

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(
  AuthProvider,
  oidcConfig,
  React.createElement(App, null)
));

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();