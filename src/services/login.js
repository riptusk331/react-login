import { verify } from "jsonwebtoken";

import { setRememberCookie } from "./cookie";

const login = (type, authObj) => {
  switch (type) {
    case "Basic":
      return loginBasic(authObj.user, authObj.pw);
    case "Bearer":
      return requestBearer(authObj);
  }
};

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

const requestBearer = async (jwt, endpoint) => {
  const requestOpts = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${jwt}`,
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

export { login, loginBasic, requestBearer };
