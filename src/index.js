import UserMixin from "./utils/user-mixin";
import { setRememberCookie, getRememberCookie } from "./services/cookie";
import { logIn, loginBasic, requestBearer } from "./services/login";
import { useLogin } from "./hooks/useLogin";

export {
  UserMixin,
  setRememberCookie,
  getRememberCookie,
  logIn,
  loginBasic,
  requestBearer,
  useLogin,
};
