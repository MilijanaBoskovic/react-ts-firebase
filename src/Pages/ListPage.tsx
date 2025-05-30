import React, { useEffect, useState } from "react";
import SingleTaskList from "../Components/SingleTaskList";
import { BE_getTaskList } from "../Backend/Queries";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { ListLoader } from "../Components/Loaders";
import FlipMove from "react-flip-move";

const ListPage = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const taskList = useSelector((state: RootState) => {
    return state.taskList.currentTaskList;
  });

  useEffect(() => {
    BE_getTaskList(dispatch, setLoading);
  }, [dispatch]);

  return (
    <div className="p-10 ">
      {loading ? (
        <ListLoader />
      ) : taskList?.length === 0 ? (
        <h1 className="text-3xl text-center text-gray-500 mt-10">
          No task list added
        </h1>
      ) : (
        <FlipMove className="flex flex-wrap justify-center gap-10">
          {taskList.map((t) => (
            <SingleTaskList singleTaskList={t} key={t.id} />
          ))}
        </FlipMove>
      )}
    </div>
  );
};

export default ListPage;
