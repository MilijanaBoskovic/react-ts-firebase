import React from "react";
import Login from "../Components/Login";

const LoginPage = () => {
  return (
    <div className=" h-[100vh] flex  items-center justify-center p-10">
      <Login />
      <div className="absolute top-0 -z-10 h-full w-full opacity-70 bg-gradient-to-r from-myBlue to-myPink" />
      <div className="w-full h-full absolute bg-pattern -z-20 top-0" />
    </div>
  );
};

export default LoginPage;
