import { useState } from "react";

const useLogin = () => {
  const [user, setUser] = useState("");
  const [pw, setPw] = useState("");

  return { user: user, pw: pw, setUser: setUser, setPw: setPw };
};

export { useLogin };
