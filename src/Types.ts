export type setLoadingType = React.Dispatch<React.SetStateAction<boolean>>;

export type authDataType = {
  email: string;
  password: string;
  confirmPassword?: string;
};

export type UserType = {
  id: string;
  username: string;
  email: string;
  img: string;
  isOnline: boolean;
  bio?: string;
  creationTime?: string;
  lastSeen?: string;
};
