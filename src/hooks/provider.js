import React, { useState } from "react";

const defaultState = {
  user: "",
  password: "",
  displayName: "",
  authenticated: false,
  rememberMe: false,
  attempts: 0,
  accessToken: null,
  accessExpires: null,
  refreshToken: null,
  refreshExpires: null,
};

const LoginContext = React.createContext();

const LoginProvider = ({ children }) => {
  const [state, dispatch] = useState({ ...defaultState });

  return (
    <LoginContext.Provider value={[state, dispatch]}>{children}</LoginContext.Provider>
  );
};

export { LoginProvider, LoginContext };
