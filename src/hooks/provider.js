import React, { useState, useEffect } from "react";
import { refreshToken } from "../services/login";
import { setLocalStorage, parseTokenToState } from "../utils/util";

const LoginContext = React.createContext();

const initialState = {
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

const LoginProvider = ({ children }) => {
  const [state, dispatch] = useState({ ...initialState });

  useEffect(() => {
    let refresh = localStorage.getItem("rl-refresh");
    if (refresh) {
      refresh = JSON.parse(refresh);
      if (Date.now() < refresh.expires) {
        const fetchToken = async () => {
          const yourToken = await refreshToken(refresh.token);
          if ("error" in yourToken) {
            console.log("invalid token used from storage");
            localStorage.removeItem('rl-refresh')
          } else {
            const newState = parseTokenToState(state, yourToken);
            setLocalStorage(newState);
            dispatch(newState);
          }
        };
        fetchToken();
      }
    }
  }, []);
  return (
    <LoginContext.Provider value={{ state, dispatch }}>{children}</LoginContext.Provider>
  );
};

export { LoginProvider, LoginContext };
