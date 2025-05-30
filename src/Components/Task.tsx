import React, { forwardRef, useState } from "react";
import Icon from "./Icon";
import { MdDelete, MdEdit, MdSave } from "react-icons/md";
import { IconBaseProps } from "react-icons";
import { taskType } from "../Types";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { collapseTask, taskSwitchEditMode } from "../redux/taskList";
import { BE_deleteTask, BE_saveTask } from "../Backend/Queries";

type Props = {
  task: taskType;
  listId: string;
};

const Task = forwardRef(
  (
    { task, listId }: Props,
    ref: React.LegacyRef<HTMLDivElement> | undefined
  ) => {
    const { id, title, description, editMode, collapsed } = task;

    const [homeTitle, setHomeTitle] = useState(title);
    const [homeDescription, setHomeDescription] = useState(description);
    const [saveLoading, setSaveLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const dispatch = useDispatch<AppDispatch>();

    const hadleSave = () => {
      const taskData: taskType = {
        id,
        title: homeTitle,
        description: homeDescription,
      };
      BE_saveTask(dispatch, listId, setSaveLoading, taskData);
    };

    const handleDelete = () => {
      if (id) BE_deleteTask(listId, id, dispatch, setDeleteLoading);
    };

    return (
      <div
        ref={ref}
        className="px-2 mb-2 bg-white rounded-md drop-shadow-sm hover:drop-shadow-md"
      >
        <div>
          {editMode ? (
            <input
              value={homeTitle}
              onChange={(e) => setHomeTitle(e.target.value)}
              className="border-2 px-2 border-myBlue rounded-sm mb-1"
              placeholder="Task title"
            />
          ) : (
            <p
              onClick={() => dispatch(collapseTask({ listId, taskId: id }))}
              className="cursor-pointer"
            >
              {title}
            </p>
          )}
        </div>

        {!collapsed && (
          <div>
            <hr />
            <div>
              {editMode ? (
                <textarea
                  value={homeDescription}
                  onChange={(e) => setHomeDescription(e.target.value)}
                  placeholder="todo description"
                  className="w-full px-3 rounded-md mt-2 border-2 border-myBlue"
                >
                  {homeDescription}
                </textarea>
              ) : (
                <p className="p-2 text-justify">{description}</p>
              )}

              <div className="flex justify-end">
                <Icon
                  onClick={() => {
                    editMode
                      ? hadleSave()
                      : dispatch(taskSwitchEditMode({ listId, id }));
                  }}
                  IconName={
                    editMode
                      ? (MdSave as React.ComponentType<IconBaseProps>)
                      : (MdEdit as React.ComponentType<IconBaseProps>)
                  }
                  loading={editMode && saveLoading}
                  size={16}
                />
                <Icon
                  loading={deleteLoading}
                  size={16}
                  onClick={handleDelete}
                  IconName={MdDelete as React.ComponentType<IconBaseProps>}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

export default Task;
