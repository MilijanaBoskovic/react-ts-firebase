import Button from "./Button";

const logo = require("../Assets/logo.jpg");

const Header = () => {
  return (
    <div className="flex flex-wrap sm:flex-row gap-p items-center justify-between drop-shadow-md bg-gradient-to-r from-myBlue to-myPink px-5 py-5 md:py-2 text-white">
      <img
        className="w-[70px] drop-shadow-md cursor-pointer"
        src={logo}
        alt="logo"
      />
      <div className="flex">
        <Button text="Add new board" secondary />
      </div>
    </div>
  );
};

export default Header;
