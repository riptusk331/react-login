import { useContext } from "react";
import { LoginContext } from "./provider";

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

  const login = () => {
    {
    }
  };

  return {
    ...state,
    setUser,
    setPw,
    setRemember,
    login,
  };
};

export { useLogin };
