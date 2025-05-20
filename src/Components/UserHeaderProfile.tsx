import { UserType } from "../Types";

type Props = {
  user: UserType;
  handleClick?: () => void;
};
const UserHeaderProfile = ({ user, handleClick }: Props) => {
  return (
    <div onClick={handleClick}>
      <div className="relative flex flex-row  space-x-4  cursor-pointer">
        <img
          src={user.img}
          alt="profile"
          className="w-11 h-11 rounded-full ring-2 ring-white p-[2px]"
        />
        <span className="-top-1 left-4 absolute w-4 h-4 border-2 border-gray-800 rounded-full bg-green-400"></span>
        <div className="hidden md:block">
          <div className="-mb-1">{user.username}</div>
          <div className="text-sm tet-gray-300 ">
            {`Joined in ${user.creationTime}`}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserHeaderProfile;
