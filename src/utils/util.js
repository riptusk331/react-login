function timingSafeStrEquals(a, b) {
  let diff = 0;
  for (let i = 0; i < a.length; ++i) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

const parseTokenToState = (state, token) => {
  const newState = { ...state };
  newState.accessToken = token.access_token;
  newState.accessExpires = Date.now() + token.access_expiration * 1000;
  newState.refreshToken = token.refresh_token;
  newState.refreshExpires = Date.now() + token.refresh_expiration * 1000;
  newState.displayName = token.name;
  newState.authenticated = true;
  return newState;
};

const setLocalStorage = (state) => {
  localStorage.setItem(
    "rl-refresh",
    JSON.stringify({ token: state.refreshToken, expires: state.refreshExpires })
  );
};

export { timingSafeStrEquals, parseTokenToState, setLocalStorage };
