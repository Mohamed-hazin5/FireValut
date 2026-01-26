import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "react-oidc-context";

const cognitoAuthConfig = {
  authority: process.env.REACT_APP_COGNITO_AUTHORITY,
  client_id: process.env.REACT_APP_CLIENT_ID,
  redirect_uri: process.env.REACT_APP_REDIRECT_URI,
  response_type: "code",
  scope: "openid email",

  // Bypass CORS by providing endpoints directly
  metadata: {
    issuer: process.env.REACT_APP_COGNITO_AUTHORITY,
    authorization_endpoint: `${process.env.REACT_APP_COGNITO_AUTHORITY}/oauth2/authorize`,
    token_endpoint: `${process.env.REACT_APP_COGNITO_AUTHORITY}/oauth2/token`,
    userinfo_endpoint: `${process.env.REACT_APP_COGNITO_AUTHORITY}/oauth2/userInfo`,
    end_session_endpoint: `${process.env.REACT_APP_COGNITO_AUTHORITY}/logout`,
    jwks_uri: `${process.env.REACT_APP_COGNITO_AUTHORITY}/.well-known/jwks.json`,
  },

  onSigninCallback: () => {
    window.history.replaceState({}, document.title, window.location.pathname);
  },
};

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthProvider {...cognitoAuthConfig}>
    <App />
  </AuthProvider>
);
