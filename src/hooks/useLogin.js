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
    const token = await requestToken(state.user, state.pw);
    const newState = { ...state };
    console.log(token)
    if (token?.access_token) {
      newState.accessToken = token.access_token;
      newState.accessExpires = Date.now() + token.expiration * 1000;
      newState.authenticated = true;
    } else {
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
