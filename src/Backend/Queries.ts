import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, db } from "./Firebase";
import { toastErr } from "../Utils/toast";
import catchErr from "../Utils/catchErr";
import { authDataType, setLoadingType, UserType } from "../Types";
import { NavigateFunction } from "react-router-dom";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { defaultUser, setUser, userStorageName } from "../redux/userSlice";
import { AppDispatch } from "../redux/store";
import ConvertTime from "../Utils/ConvertTime";
import avatarGenerator from "../Utils/avatarGenerator";

const usersColl = "users";
const tasksColl = "tasks";
const tasksListColl = "tasksList";
const chatsColl = "chats";
const messagesColl = "messages";

//register user
export const BE_signUp = (
  data: authDataType,
  setLoading: setLoadingType,
  reset: () => void,
  goTo: NavigateFunction,
  dispatch: AppDispatch
) => {
  const { email, password, confirmPassword } = data;
  setLoading(true);
  //loading true
  if (email && password) {
    if (password === confirmPassword) {
      createUserWithEmailAndPassword(auth, email, password)
        .then(async ({ user }) => {
          const username = user.email?.split("@")[0] || "";
          const avatar = avatarGenerator(username);

          const userInfo = await addUserToCollection(
            user.uid,
            user.email || "",
            username,
            avatar
          );

          dispatch(setUser(userInfo));
          console.log(user);
          setLoading(false);
          reset();
          goTo("/dashboard");
        })
        .catch((err) => {
          catchErr(err);
          setLoading(false);
        });
    } else toastErr("Passwords must match", setLoading);
  } else toastErr("Fields should not be empty", setLoading);
};

//login user
export const BE_signIn = (
  data: authDataType,
  setLoading: setLoadingType,
  reset: () => void,
  goTo: NavigateFunction,
  dispatch: AppDispatch
) => {
  const { email, password } = data;
  setLoading(true);
  //loading true
  if (email && password) {
    signInWithEmailAndPassword(auth, email, password)
      .then(async ({ user }) => {
        //update isOnline
        updateUserInfo({ id: user.uid, isOnline: true });
        //get user info
        const userInfo = await getUserInfo(user.uid);
        //set user in the store
        dispatch(setUser(userInfo));
        //set user in  local storage
        console.log(user);
        setLoading(false);
        reset();
        goTo("/dashboard");
      })
      .catch((err) => {
        catchErr(err);
        setLoading(false);
      });
  } else toastErr("Fields should not be empty", setLoading);
};

export const BE_signOut = (
  dispatch: AppDispatch,
  goTo: NavigateFunction,
  loading: setLoadingType
) => {
  loading(true);
  signOut(auth)
    .then(async () => {
      await updateUserInfo({ isOffline: true });

      dispatch(setUser(defaultUser));

      localStorage.removeItem(userStorageName);
      loading(false);
      goTo("/auth");
    })
    .catch((e) => {
      catchErr(e);
    });
};

// add user to collection
const addUserToCollection = async (
  id: string,
  email: string,
  username: string,
  img: string
) => {
  await setDoc(doc(db, usersColl, id), {
    isOnline: true,
    img,
    username,
    email,
    creationTime: serverTimestamp(),
    lastSeen: serverTimestamp(),
    bio: "Hi! I am user",
  });

  return getUserInfo(id);
};

// get user information
const getUserInfo = async (id: string): Promise<UserType> => {
  const userRef = doc(db, usersColl, id);
  const user = await getDoc(userRef);

  if (user.exists()) {
    const { img, isOnline, username, email, bio, creationTime, lastSeen } =
      user.data();

    return {
      id: user.id,
      img,
      isOnline,
      username,
      email,
      bio,
      creationTime: creationTime
        ? ConvertTime(creationTime.toDate())
        : "no date yet",
      lastSeen: lastSeen ? ConvertTime(lastSeen.toDate()) : "no date yet",
    };
  } else {
    toastErr("getUserInfo:user not found");
    return defaultUser;
  }
};

//update user info
const updateUserInfo = async ({
  id,
  username,
  img,
  isOnline,
  isOffline,
}: {
  id?: string;
  username?: string;
  img?: string;
  isOnline?: boolean;
  isOffline?: boolean;
}) => {
  if (!id) {
    id = getStorageUser().id;
  }
  if (id) {
    const docRef = doc(db, usersColl, id);
    await updateDoc(docRef, {
      ...(username && { username }),
      ...(img && { img }),
      ...(isOnline && { isOnline }),
      ...(isOffline && { isOnline: false }),
      lastSeen: serverTimestamp(),
    });
  }
};

export const getStorageUser = () => {
  const userStr = localStorage.getItem("logged_user");

  if (userStr) {
    return JSON.parse(userStr);
  }
  return null;
};
