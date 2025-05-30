import React, { forwardRef, useEffect, useState } from "react";
import {
  MdAdd,
  MdDelete,
  MdEdit,
  MdKeyboardArrowDown,
  MdSave,
} from "react-icons/md";
import Icon from "./Icon";
import { IconBaseProps } from "react-icons";
import Tasks from "./Tasks";
import { taskListType } from "../Types";
import {
  BE_addTask,
  BE_deleteTaskList,
  BE_getTasksForTaskList,
  BE_saveTaskList,
} from "../Backend/Queries";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { collapseAllTask, taskListSwithEditMode } from "../redux/taskList";
import { TaskListTasksLoader } from "./Loaders";

type Props = {
  singleTaskList: taskListType;
};

const SingleTaskList = forwardRef(
  ({ singleTaskList }: Props, ref: React.Ref<HTMLDivElement> | undefined) => {
    const { id, editMode, tasks = [], title } = singleTaskList;

    const [homeTitle, setHomeTitle] = useState(title);
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [addTaskLoading, setAddTaskLoading] = useState(false);

    const [tasksLoading, setTasksLoading] = useState(false);

    const [allCollapsed, setAllCollapsed] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
      //get tasks
      if (id) BE_getTasksForTaskList(dispatch, id, setTasksLoading);
    }, [dispatch, id]);

    useEffect(() => {
      const checkAllCollapsed = () => {
        for (let i = 0; i < tasks?.length; i++) {
          const task = tasks[i];

          if (!task.collapsed) return setAllCollapsed(false);
        }
        return setAllCollapsed(true);
      };
      checkAllCollapsed();
    }, [tasks]);

    const handleSaveTaskListTitle = () => {
      if (id) BE_saveTaskList(dispatch, setLoading, id, homeTitle);
    };
    const handleDeleteTaskList = () => {
      if (id && tasks) BE_deleteTaskList(id, tasks, dispatch, setDeleteLoading);
    };
    const handleAddTask = () => {
      if (id) BE_addTask(dispatch, id, setAddTaskLoading);
    };

    const checkEnterKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleSaveTaskListTitle();
    };

    const handleCollapseClick = () => {
      if (allCollapsed) {
        return dispatch(collapseAllTask({ listId: id, value: false }));
      }

      return dispatch(collapseAllTask({ listId: id, value: true }));
    };

    return (
      <div ref={ref} className="relative">
        <div className="bg-[#d3f0f9] w-full md:w-[400px] drop-shadow-md rounded-md overflow-hidden min-h-[150px]">
          <div className="flex flex-wrap items-center justify-center  bg-gradient-to-r from-myBlue to-myPink bg-opacity-70 p-3 text-white text-center">
            {editMode ? (
              <input
                value={homeTitle}
                onChange={(e) => setHomeTitle(e.target.value)}
                onKeyDown={(e) => checkEnterKey(e)}
                placeholder="Enter task list title"
                className="flex-1 bg-transparent placeholder-gray-300 px-3 py-1 border-[1px] border-white rounded-md"
              />
            ) : (
              <p className="flex-1 text-left md:text-center">{title}</p>
            )}

            <div>
              <Icon
                IconName={
                  editMode
                    ? (MdSave as React.ComponentType<IconBaseProps>)
                    : (MdEdit as React.ComponentType<IconBaseProps>)
                }
                onClick={() =>
                  editMode
                    ? handleSaveTaskListTitle()
                    : dispatch(taskListSwithEditMode({ id }))
                }
                loading={editMode && loading}
              />
              <Icon
                IconName={MdDelete as React.ComponentType<IconBaseProps>}
                loading={deleteLoading}
                onClick={handleDeleteTaskList}
              />
              <Icon
                IconName={
                  MdKeyboardArrowDown as React.ComponentType<IconBaseProps>
                }
                className={`${allCollapsed ? "rotate-180" : "rotate-0"} `}
                onClick={handleCollapseClick}
              />
            </div>
          </div>
          {tasksLoading ? (
            <TaskListTasksLoader />
          ) : (
            id && <Tasks tasks={tasks || []} listId={id} />
          )}
        </div>
        <Icon
          IconName={MdAdd as React.ComponentType<IconBaseProps>}
          className="absolute -mt-6 -ml-4 p-3 drop-shadow-lg hover:bg-myPink"
          reduceOpacityOnHover={false}
          onClick={handleAddTask}
          loading={addTaskLoading}
        />
      </div>
    );
  }
);

export default SingleTaskList;
