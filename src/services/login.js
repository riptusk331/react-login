/**
 *
 * This function accepts a username & password and performs Basic HTTP authentication
 * to the backend. It expects a token
 * Log a user in to the backend via basic auth, and store the auth token in the redux
 * store. Accepts a callback
 *
 * @param {string} user the username to log in to the backend with
 * @param {string} pw the password to log in to the backend with
 * @param {function} callback an optional callback function to execute after successful login
 */
const requestToken = async (user, pw) => {
  const token = await _backendLogin("Basic", { user: user, pw: pw });
  return token;
};

const refreshToken = async (token) => {
  const newToken = await _backendLogin("Refresh", token);
  return newToken
}

/**
 *
 * @param {*} type
 * @param {*} authObj
 */
const _backendLogin = (type, authObj) => {
  switch (type) {
    case "Basic":
      return httpAuthBasic(authObj.user, authObj.pw);
    case "Refresh":
      return httpAuthRefresh(authObj)
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
const httpAuthBasic = async (user, pw) => {
  const loginBase = btoa(`${user}:${pw}`);
  const requestOpts = {
    method: "POST",
    headers: {
      Authorization: `Login ${loginBase}`,
    },
  };
  const resp = await fetch(process.env.REACT_APP_TOKEN_ENDPOINT, requestOpts);
  const respJson = await resp.json();
  return respJson;
};

const httpAuthBearer = async (jwt, endpoint, reqType = "GET") => {
  const requestOpts = {
    method: reqType,
    headers: {
      Authorization: `Bearer ${jwt}`,
    },
  };
  const resp = await fetch(endpoint, requestOpts);
  return await resp.json();
};

const httpAuthRefresh = async (jwt, reqType = "POST") => {
  const requestOpts = {
    method: reqType,
    headers: {
      Authorization: `Refresh ${jwt}`,
    },
  };
  const resp = await fetch(process.env.REACT_APP_REFRESH_ENDPOINT, requestOpts);
  return await resp.json();
};

export { requestToken, refreshToken, httpAuthBasic, httpAuthBearer };
