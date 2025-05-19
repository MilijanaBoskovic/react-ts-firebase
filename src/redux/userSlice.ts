import { createSlice } from "@reduxjs/toolkit";
import { UserType } from "../Types";

export const defaultUser: UserType = {
  id: "",
  username: "",
  email: "",
  isOnline: false,
  img: "",
  bio: "",
  creationTime: "",
  lastSeen: "",
};

const initialState = {
  user: [],
  currentUser: defaultUser,
  // currentSelectedUser:null
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const user = action.payload;
      //save user to local storage
      localStorage.setItem("logged_user", JSON.stringify(user));

      //set logged in user
      state.currentUser = user;
    },
    setUsers: (state, action) => {
      //set all users
    },
  },
});

export const { setUser, setUsers } = userSlice.actions;
export default userSlice.reducer;
