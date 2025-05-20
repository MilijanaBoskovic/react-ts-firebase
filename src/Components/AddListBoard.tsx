import { IconBaseProps } from "react-icons";
import Button from "./Button";
import Icon from "./Icon";
import { MdAdd } from "react-icons/md";

const AddListBoard = () => {
  return (
    <>
      <Button text="Add new board" clasName="hidden md:flex" />
      <Icon
        IconName={MdAdd as React.ComponentType<IconBaseProps>}
        className="block md:hidden"
      />{" "}
    </>
  );
};
export default AddListBoard;
