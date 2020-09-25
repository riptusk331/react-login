import Cookies from "universal-cookie";
import hmacSHA512 from "crypto-js/hmac-sha512";
import Utf8 from "crypto-js/enc-utf8";
import Hex from "crypto-js/enc-hex";
import Base64 from "crypto-js/enc-base64";

import {
  REMEMBER_COOKIE_NAME,
  REMEMBER_COOKIE_LENGTH,
  REMEMBER_COOKIE_SAMESITE,
  JWT_COOKIE_NAME,
  JWT_COOKIE_LENGTH,
  JWT_COOKIE_SAMESITE,
} from "../config";
import { timingSafeStrEquals } from "../utils/util";

const cookies = new Cookies();

const setRememberCookie = (payload) => {
  cookies.set(
    REMEMBER_COOKIE_NAME,
    _encodeRememberCookie(payload, process.env.REACT_APP_SECRET_KEY),
    {
      maxAge: REMEMBER_COOKIE_LENGTH,
      sameSite: REMEMBER_COOKIE_SAMESITE,
      encode: encodeURI,
    }
  );
};

const getRememberCookie = () => {
  const cookie = cookies.get(REMEMBER_COOKIE_NAME, { decode: decodeURI });
  return cookie ? _decodeRememberCookie(cookie) : null;
};

const setSessionCookie = (jwt) => {
  cookies.set(JWT_COOKIE_NAME, jwt, {
    maxAge: JWT_COOKIE_LENGTH,
    sameSite: JWT_COOKIE_SAMESITE,
  });
};

const _encodeRememberCookie = (payload, key) => {
  /* Use the supplied payload and secret key to create a Base64 encoded
"remember-rl" cookie for react-login to securely authenticate long term
between sessions.

Returns the Base64 encoded cookie
*/
  const encPayload = Base64.stringify(Utf8.parse(payload));
  const encCookie = `${encPayload}.${_rememberCookieDigest(payload, key)}`;
  return encCookie;
};

const _decodeRememberCookie = (cookie) => {
  /* Take a Base64 encoded "remember-rl" cookie set by react-login and
validate it. If the cookie checks out, return the decoded cookie payload.

Performs a bitwise comparison of the cookie digest vs the test digest to
defend against timing attacks.
*/
  const [payload, digest] = cookie.split(".");
  const decPayload = Base64.parse(payload).toString(Utf8);
  const test = _rememberCookieDigest(decPayload, process.env.REACT_APP_SECRET_KEY);

  if (timingSafeStrEquals(test, digest)) return decPayload;
};

const _rememberCookieDigest = (payload, key) => {
  /* Create a keyed hash digest of the supplied payload, using the supplied
  key.

  Returns a Hex encoded hash digest
  */
  const enc = Utf8.parse(payload);
  const digest = hmacSHA512(enc, key).toString(Hex);
  return digest;
};

export { setRememberCookie, getRememberCookie, setSessionCookie };
