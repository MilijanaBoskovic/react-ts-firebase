import React, { useEffect, useState } from "react";
import Input from "../Components/Input";
import Button from "../Components/Button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import avatarGenerator from "../Utils/avatarGenerator";
import { toastErr, toastWarn } from "../Utils/toast";
import { BE_deleteUserAcc, BE_saveProfile } from "../Backend/Queries";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const [saveLoading, setSaveLoading] = useState(false);
  const [deleteAccLoading, setDeleteAccLoading] = useState(false);

  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const dispatch = useDispatch<AppDispatch>();
  const goTo = useNavigate();

  useEffect(() => {
    setEmail(currentUser.email);
    setUsername(currentUser.username);
  }, [currentUser]);

  const handleAvatarGenerate = () => {
    setAvatar(avatarGenerator(username));
  };

  const handleSaveProfile = async () => {
    if (!email || !username) toastErr("Email or username can't be empty");

    let tempPass = password;
    if (tempPass && tempPass !== confirmPassword) {
      toastErr("Passwords have to be equal");
      tempPass = "";
    }
    //update email only if it is changed
    let tempEmail = email;
    if (tempEmail === currentUser.email) tempEmail = "";

    let tempUsername = username;
    if (tempUsername === currentUser.username) tempUsername = "";

    let tempAvatar = avatar;
    if (tempAvatar === currentUser.img) tempAvatar = "";

    if (tempEmail || tempUsername || tempPass || tempAvatar) {
      await BE_saveProfile(dispatch, setSaveLoading, {
        email: tempEmail,
        password: tempPass,
        username: tempUsername,
        img: tempAvatar,
      });
    } else {
      toastWarn("Change info before saving");
    }
  };

  const handleDeleteAcc = async () => {
    if (
      window.confirm("are you sure to delete account? It can not be reversed")
    ) {
      await BE_deleteUserAcc(dispatch, goTo, setDeleteAccLoading);
    }
  };

  return (
    <div className="bg-white flex flex-col gap-5 shadow-md max-w-2xl rounded-xl py-5 px-6 md:p-10 md:m-auto m-5 md:mt-10">
      <div className="relative self-center " onClick={handleAvatarGenerate}>
        <img
          alt="profile pic"
          className="w-32 h-32 md:w-48 md:h-48 rounded-full p-[2px] ring-2 ring-gray-300 cursor-pointer hover:shadow-lg"
          src={avatar || currentUser.img}
        />
        <span className="absolute top-7 md:top-6 left-28 md:left-40 w-5 h-5 border-2 border-gray-800 rounded-full bg-green-400"></span>
      </div>
      <p className="text-gray-400 text-s text-center">{`Note: Click on image to temporarly change it, when you like it, then save profile. You can leave password and username as they are if you don't want to change them`}</p>

      <div className="flex flex-col gap-2">
        <Input
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value.trim())}
        />
        <Input
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value.trim())}
        />
        <Input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Input
          name="confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <Button
          text={"Update profile"}
          onClick={handleSaveProfile}
          loading={saveLoading}
        />
        <Button
          text={"Delete account"}
          secondary
          loading={deleteAccLoading}
          onClick={handleDeleteAcc}
        />
      </div>
    </div>
  );
};

export default ProfilePage;
