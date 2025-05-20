import AddListBoard from "./AddListBoard";
import UserHeaderProfile from "./UserHeaderProfile";
import { IconBaseProps } from "react-icons";
import { BsFillCartFill } from "react-icons/bs";
import { FiList } from "react-icons/fi";
import Icon from "./Icon";

import logo from "../Assets/logo.jpg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { BE_signOut, getStorageUser } from "../Backend/Queries";
import Spinner from "./Spinner";
import { useEffect, useState } from "react";
import { setUser } from "../redux/userSlice";

const Header = () => {
  const [logoutLoading, setLogoutLoading] = useState(false);

  const dispatch = useDispatch();
  const goTo = useNavigate();
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const user = getStorageUser();

  useEffect(() => {
    if (user?.id) {
      dispatch(setUser(user));
    } else {
      goTo("/auth");
    }
  }, []);

  useEffect(() => {
    const page = getCurrentPage();
    if (page) goTo(`/dashboard/${page}`);
  }, [goTo]);

  const handleGoToPage = (page: string) => {
    goTo(`/dashboard/${page}`);
    if (page) setCurrentPage(page);
  };

  const handleSignOut = () => {
    BE_signOut(dispatch, goTo, setLogoutLoading);
  };

  const setCurrentPage = (page: string) => {
    localStorage.setItem("current-page", page);
  };
  const getCurrentPage = () => {
    return localStorage.getItem("current-page");
  };

  return (
    <div className="flex flex-wrap sm:flex-row gap-p items-center justify-between drop-shadow-md bg-gradient-to-r from-myBlue to-myPink px-5 py-5 md:py-2 text-white">
      <img
        className="w-[70px] drop-shadow-md cursor-pointer"
        src={logo}
        alt="logo"
      />
      <div className="flex flex-row-reverse md:flex-row justify-center gap-5 flex-wrap">
        {getCurrentPage() === "chat" ? (
          <Icon
            IconName={FiList as React.ComponentType<IconBaseProps>}
            onClick={() => handleGoToPage("list")}
          />
        ) : getCurrentPage() === "profile" ? (
          <>
            <Icon
              IconName={FiList as React.ComponentType<IconBaseProps>}
              onClick={() => handleGoToPage("list")}
            />
            <Icon
              IconName={BsFillCartFill as React.ComponentType<IconBaseProps>}
              ping={true}
              onClick={() => handleGoToPage("chat")}
            />{" "}
          </>
        ) : (
          <>
            <AddListBoard />
            <Icon
              IconName={BsFillCartFill as React.ComponentType<IconBaseProps>}
              ping={true}
              onClick={() => handleGoToPage("chat")}
            />
          </>
        )}

        <div className="group relative">
          <UserHeaderProfile user={currentUser} />
          <div className="absolute pt-5 hidden group-hover:block w-full min-w-max overflow-hidden">
            <ul className="w-full bg-white overflow-hidden rounded-md shadow-md text-gray-700 pt-1">
              <p
                className="hover:bg-gray-200 py-2 px-4 block"
                onClick={() => handleGoToPage("profile")}
              >
                Profile
              </p>
              <p
                onClick={() => !logoutLoading && handleSignOut()}
                className={`hover:bg-gray-200 py-2 px-4 flex items-center gap-4 ${
                  logoutLoading && "cursor-wait"
                }`}
              >
                Logout
                {logoutLoading && <Spinner />}
              </p>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
