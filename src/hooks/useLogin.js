import { useContext, useEffect } from "react";
import { LoginContext } from "./provider";
import { requestToken } from "../services/login";
import { parseTokenToState, setLocalStorage } from "../utils/util";

const useLogin = () => {
  const {state, dispatch} = useContext(LoginContext);

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
    let newState = { ...state };
    if ("access_token" in token && "refresh_token" in token) {
      newState = parseTokenToState(newState, token);
      newState.authenticated = true;
      setLocalStorage(newState);
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
