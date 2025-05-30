import { toastErr } from "./toast";

const catchErr = (err: { code?: string }) => {
  const { code } = err;

  if (code === "auth/invalid-email") toastErr("invalid email");
  else if (code === "auth/weak-password")
    toastErr("password needs at leat 6 charachters");
  else if (code === "auth/user-not-found") toastErr("user not found");
  else if (code === "auth/email-already-in-use") toastErr("wrong password");
  else if (code === "auth/requires-recent-login")
    toastErr("login again before updating profile");
  else if (code === "unavailable") toastErr("Firebase client is offline");
  else if (code === "auth/operation-not-allowed")
    toastErr("Can't change email now");
  else {
    toastErr("Error occured");
    console.log(err, err.code);
  }
};

export default catchErr;
