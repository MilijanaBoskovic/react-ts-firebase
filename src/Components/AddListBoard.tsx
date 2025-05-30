import { IconBaseProps } from "react-icons";
import Button from "./Button";
import Icon from "./Icon";
import { MdAdd } from "react-icons/md";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { BE_addTaskList } from "../Backend/Queries";

const AddListBoard = () => {
  const [addLoading, setAddLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleAddTaskList = () => {
    BE_addTaskList(dispatch, setAddLoading);
  };

  return (
    <>
      <Button
        text="Add new board"
        clasName="hidden md:flex"
        loading={addLoading}
        onClick={handleAddTaskList}
      />
      <Icon
        IconName={MdAdd as React.ComponentType<IconBaseProps>}
        onClick={handleAddTaskList}
        loading={addLoading}
        className="block md:hidden"
      />{" "}
    </>
  );
};
export default AddListBoard;
