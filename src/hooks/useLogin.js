import { useContext } from "react";
import { LoginContext } from "./provider";
import { requestToken } from "../services/login";

const useLogin = () => {
  const [state, dispatch] = useContext(LoginContext);

  const setUser = (user) => {
    const newState = { ...state };
    newState.user = user;
    dispatch(newState);
  };

  const setPw = (password) => {
    const newState = { ...state };
    newState.password = password;
    dispatch(newState);
  };

  const setRemember = (val) => {
    const newState = { ...state };
    newState.rememberMe = val;
    dispatch(newState);
  };

  const logIn = async () => {
    const token = await requestToken(state.user, state.password);
    const newState = { ...state };
    if ("access_token" in token && "refresh_token" in token) {
      newState.accessToken = token.access_token;
      newState.accessExpires = Date.now() + token.access_expiration * 1000;
      newState.refreshToken = token.refresh_token;
      newState.refreshExpires = Date.now() + token.refresh_expiration * 1000;
      newState.displayName = token.name;
      newState.authenticated = true;
    } else if ("error" in token) {
      newState.attempts += 1;
    }
    dispatch(newState);
  };

  return {
    ...state,
    setUser,
    setPw,
    setRemember,
    logIn,
  };
};

export { useLogin };
