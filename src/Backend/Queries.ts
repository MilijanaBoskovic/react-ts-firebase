import {
  createUserWithEmailAndPassword,
  deleteUser,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { auth, db } from "./Firebase";
import { toastErr, toastSucc } from "../Utils/toast";
import catchErr from "../Utils/catchErr";
import {
  authDataType,
  setLoadingType,
  taskListType,
  taskType,
  UserType,
} from "../Types";
import { NavigateFunction } from "react-router-dom";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { defaultUser, setUser, userStorageName } from "../redux/userSlice";
import { AppDispatch } from "../redux/store";
import ConvertTime from "../Utils/ConvertTime";
import avatarGenerator from "../Utils/avatarGenerator";
import {
  addTask,
  addTaskList,
  defaultTask,
  defaultTaskList,
  deleteTask,
  deleteTaskList,
  saveTask,
  saveTaskListTitle,
  setTaskList,
  setTaskListTasks,
} from "../redux/taskList";
import { list } from "postcss";
import { defaultMethod } from "react-router-dom/dist/dom";

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
  loading: setLoadingType,
  deleteAcc?: boolean
) => {
  loading(true);
  signOut(auth)
    .then(async () => {
      if (!deleteAcc) await updateUserInfo({ isOffline: true });

      dispatch(setUser(defaultUser));

      localStorage.removeItem(userStorageName);
      goTo("/auth");
      loading(false);
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

export const BE_saveProfile = async (
  dispatch: AppDispatch,
  setLoading: setLoadingType,
  data: { email: string; username: string; password: string; img: string }
) => {
  setLoading(true);

  const { email, username, password, img } = data;
  const id = getStorageUser().id;

  if (id && auth.currentUser) {
    if (email) {
      updateEmail(auth.currentUser, email)
        .then(() => {
          toastSucc("Email changed successfully");
        })
        .catch((err) => catchErr(err));
    }

    if (password) {
      updatePassword(auth.currentUser, password)
        .then(() => {
          toastSucc("Password changed successfully");
        })
        .catch((err) => catchErr(err));
    }

    if (username || img) {
      await updateUserInfo({ username, img });
      toastSucc("Profile updated successfully");
    }

    const updatedUser = await getUserInfo(id);
    dispatch(setUser(updatedUser));
    setLoading(false);
  } else {
    toastErr("BE_saveProfile: User id not found");
  }
};

export const BE_deleteUserAcc = async (
  dispatch: AppDispatch,
  goTo: NavigateFunction,
  setLoading: setLoadingType
) => {
  setLoading(true);

  //get all task lists for user and delete them

  const userLists = await getAllTaskList();

  if (userLists?.length > 0) {
    userLists.forEach(async (tl) => {
      if (tl.id && tl.tasks) await BE_deleteTaskList(tl.id, tl.tasks, dispatch);
    });
  }

  //delete user information from collection

  await deleteDoc(doc(db, usersColl, getStorageUser().id));

  //delete from auth

  const user = auth.currentUser;

  if (user) {
    deleteUser(user)
      .then(() => {
        BE_signOut(dispatch, goTo, setLoading, true);

        //window.location.reload();
      })
      .catch((err) => catchErr(err));
  }
};
//------------------------TASK LIST-----------------------------

// add task list
export const BE_addTaskList = async (
  dispatch: AppDispatch,
  setLoading: setLoadingType
) => {
  setLoading(true);

  const { title } = defaultTaskList;
  //we don't need to use setDoc because id of document is no matter to us
  const list = await addDoc(collection(db, tasksListColl), {
    title,
    userId: getStorageUser().id,
  });

  const docRef = doc(db, list.path);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const newlyAddedDoc: taskListType = {
      id: docSnap.id,
      title: docSnap.data().title,
    };
    dispatch(addTaskList(newlyAddedDoc));
    setLoading(false);
  } else {
    toastErr("BE_addTaskList:No such doc");
    setLoading(false);
  }
};

export const BE_getTaskList = async (
  dispatch: AppDispatch,
  setLoading: setLoadingType
) => {
  setLoading(true);

  const taskList = await getAllTaskList();

  dispatch(setTaskList(taskList));
  setLoading(false);
};

// get all task lists for specific user
const getAllTaskList = async () => {
  const taskListsRefs = query(
    collection(db, tasksListColl),
    where("userId", "==", getStorageUser().id)
  );

  const taskListSnapshot = await getDocs(taskListsRefs);
  const taskLists: taskListType[] = [];

  taskListSnapshot.forEach((doc) => {
    const { title } = doc.data();
    taskLists.push({
      title,
      id: doc.id,
      editMode: false,
      tasks: [],
    });
  });
  return taskLists;
};

// save task list title
export const BE_saveTaskList = async (
  dispatch: AppDispatch,
  setLoading: setLoadingType,
  listId: string,
  title: string
) => {
  setLoading(true);

  await updateDoc(doc(db, tasksListColl, listId), { title });
  const updatedTaskList = await getDoc(doc(db, tasksListColl, listId));

  setLoading(false);

  //dispatch to save to store
  dispatch(
    saveTaskListTitle({ id: updatedTaskList.id, ...updatedTaskList.data() })
  );
};
// delete task list
export const BE_deleteTaskList = async (
  listId: string,
  tasks: taskType[],
  dispatch: AppDispatch,
  setLoading?: setLoadingType
) => {
  if (setLoading) setLoading(true);

  //deleting tasks
  if (tasks?.length > 0) {
    for (let i = 0; i < tasks?.length; i++) {
      const { id } = tasks[i];
      if (id && setLoading) BE_deleteTask(listId, id, dispatch, setLoading);
    }
  }
  //delete list
  const listRef = doc(db, tasksListColl, listId);

  await deleteDoc(listRef);
  const deletedTaskList = await getDoc(listRef);

  if (!deletedTaskList.exists()) {
    if (setLoading) setLoading(false);
    dispatch(deleteTaskList(listId));
  }
};

export const BE_deleteTask = async (
  listId: string,
  id: string,
  dispatch: AppDispatch,
  setLoading: setLoadingType
) => {
  if (setLoading) setLoading(true);

  const taskRef = doc(db, tasksListColl, listId, tasksColl, id);

  await deleteDoc(taskRef);

  const deletedTask = await getDoc(taskRef);

  if (!deletedTask.exists()) {
    if (setLoading) setLoading(false);
    dispatch(deleteTask({ listId, id }));
  }
};

export const BE_addTask = async (
  dispatch: AppDispatch,
  listId: string,
  setLoading: setLoadingType
) => {
  setLoading(true);

  const task = await addDoc(collection(db, tasksListColl, listId, tasksColl), {
    ...defaultTask,
  });

  const newTaskSnapshot = await getDoc(doc(db, task.path));

  if (newTaskSnapshot.exists()) {
    const { title, description } = newTaskSnapshot.data();

    const newTask: taskType = {
      id: newTaskSnapshot.id,
      title,
      description,
    };

    //add in store
    dispatch(addTask({ listId, task: newTask }));
  } else {
    toastErr("BE_addTask: No such document");
  }
  setLoading(false);
};

export const BE_saveTask = async (
  dispatch: AppDispatch,
  listId: string,
  setLoading: setLoadingType,
  data: taskType
) => {
  setLoading(true);
  const { id, title, description } = data;
  if (id) {
    const taskRef = doc(db, tasksListColl, listId, tasksColl, id);
    await updateDoc(taskRef, { title, description });
    const updatedTask = await getDoc(taskRef);

    if (updatedTask.exists()) {
      setLoading(false);
      dispatch(saveTask({ listId, id: updatedTask.id, ...updatedTask.data() }));
    } else {
      toastErr("BE_saveTask: updated task not found");
    }
  } else {
    toastErr("BE_saveTask: id not found");
  }
};

export const BE_getTasksForTaskList = async (
  dispatch: AppDispatch,
  listId: string,
  setLoading: setLoadingType
) => {
  setLoading(true);

  const tasksRef = collection(db, tasksListColl, listId, tasksColl);
  const tasksSnapshot = await getDocs(tasksRef);

  const tasks: taskType[] = [];

  if (!tasksSnapshot.empty) {
    tasksSnapshot.forEach((task) => {
      const { title, description } = task.data();

      tasks.push({
        id: task.id,
        title,
        description,
        editMode: false,
        collapsed: true,
      });
    });
  }
  dispatch(setTaskListTasks({ listId, tasks }));
  setLoading(false);
};
