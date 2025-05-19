import { Link, useNavigate } from "react-router-dom";
import { BE_signIn, BE_signUp } from "../Backend/Queries";
import Button from "./Button";
import Input from "./Input";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { authDataType } from "../Types";

const Login = () => {
  const [login, setLogin] = useState(true);
  const [signUpLoading, setSignUpLoading] = useState(false);
  const [signInLoading, setSignInLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const goTo = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const reset = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleSignUp = () => {
    const data = { email, password, confirmPassword };
    auth(data, BE_signUp, setSignUpLoading);
  };
  const handleSignIn = () => {
    const data = { email, password, confirmPassword };
    auth(data, BE_signIn, setSignInLoading);
  };

  const auth = (
    data: authDataType,
    func: any,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    func(data, setLoading, reset, goTo, dispatch);
  };

  return (
    <div className="w-full md:w-[450px]">
      <h1 className="text-white text-center font-bold text-4xl md:text-6xl mb-10">
        {login ? "Login" : "Register"}
      </h1>
      <div className="flex flex-col gap-3 bg-white w-full p-6 min-h-[150px] rounded-xl drop-shadow-xl">
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          name="email"
          type="email"
        />
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          name="password"
          type="password"
        />
        {!login && (
          <Input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            name="confirm password"
            type="password"
          />
        )}
        {login ? (
          <>
            <Button
              text="Login"
              onClick={handleSignIn}
              loading={signInLoading}
            />
            <Button text="Register" secondary onClick={() => setLogin(false)} />
          </>
        ) : (
          <>
            <Button
              text="Register"
              onClick={handleSignUp}
              loading={signUpLoading}
            />
            <Button text="Login" secondary onClick={() => setLogin(true)} />
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
