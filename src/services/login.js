import { verify } from "jsonwebtoken";

import { setRememberCookie } from "./cookie";
import UserMixin from "../utils/user-mixin";

/**
 * Redux compatible login.
 *
 * This function accepts a username & password and performs Basic HTTP authentication
 * to the backend. It expects a token
 * Log a user in to the backend via basic auth, and store the auth token in the redux
 * store. Accepts a callback
 *
 * @param {string} user the username to log in to the backend with
 * @param {string} pw the password to log in to the backend with
 * @param {function} callback the redux callback function to execute after successful login
 */
const logIn = (user, pw, callback) => {
  return async (dispatch) => {
    const token = await _backendLogin("Basic", { user: user, pw: pw });
    if (token) {
      const user = new UserMixin(token);
      dispatch(callback(user, user.token));
    }
  };
};

/**
 *
 * @param {*} type
 * @param {*} authObj
 */
const _backendLogin = (type, authObj) => {
  switch (type) {
    case "Basic":
      return loginBasic(authObj.user, authObj.pw);
    case "Bearer":
      return requestBearer(authObj);
  }
};

/**
 * Perform Basic HTTP authentication to the backend endpoint supplied in the
 * REACT_APP_TOKEN_ENDPOINT environment variable.
 *
 * Encodes the user & pw parameters to a base-64 Authorization header and requests
 * authentiation to the server.
 *
 * Expects a JSON Web Token in the response. This JWT is verified, and if valid, used
 * to generate a "remember me" cookie and then returned
 *
 * @param {string} user
 * @param {string} pw
 * @returns {object} response object containing auth token
 */
const loginBasic = async (user, pw) => {
  const loginBase = btoa(`${user}:${pw}`);
  const requestOpts = {
    method: "POST",
    headers: {
      Authorization: `Basic ${loginBase}`,
    },
  };
  const resp = await fetch(process.env.REACT_APP_TOKEN_ENDPOINT, requestOpts);
  const respJson = await resp.json();
  try {
    const verified = await verifyJWT(respJson.token);
    if (verified) {
      setRememberCookie(verified[process.env.REACT_APP_USER_DESCRIPTOR]);
      return respJson;
    }
  } catch (err) {
    console.log(err);
  }
};

const requestBearer = async (jwt, endpoint, reqType="GET") => {
  const requestOpts = {
    method: reqType,
    headers: {
      Authorization: `Bearer ${jwt}`,
      "X-Csrf-Token": "ryan"
    },
  };
  const resp = await fetch(endpoint, requestOpts);
  return await resp.json();
};

const verifyJWT = (token) => {
  return new Promise((resolve, error) => {
    try {
      const jwtArr = token.split(".");
      var algHeader = JSON.parse(atob(jwtArr[0]));
      const decoded = verify(token, process.env.REACT_APP_SECRET_KEY, {
        algorithms: algHeader.alg,
      });
      resolve(decoded);
    } catch (err) {
      error(err);
    }
  });
};

export { logIn, loginBasic, requestBearer };
