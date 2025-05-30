import { createSlice } from "@reduxjs/toolkit";
import { taskListType, taskType } from "../Types";

export const defaultTaskList: taskListType = {
  title: "Sample Task List",
};
export const defaultTask: taskType = {
  title: "I ll do thiss",
  description: "THis what I need to do",
};

type taskListSliceType = {
  currentTaskList: taskListType[];
};
const initialState: taskListSliceType = {
  currentTaskList: [],
};

const taskListSlice = createSlice({
  name: "taskList",
  initialState,
  reducers: {
    setTaskList: (state, action) => {
      state.currentTaskList = action.payload;
    },
    addTaskList: (state, action) => {
      const newTaskList = action.payload;
      newTaskList.editMode = true;
      newTaskList.tasks = [];
      state.currentTaskList.unshift(newTaskList);
    },
    saveTaskListTitle: (state, action) => {
      const { id, title } = action.payload;
      state.currentTaskList = state.currentTaskList.map((t) => {
        if (t.id === id) {
          t.title = title;
          t.editMode = false;
        }
        return t;
      });
    },
    taskListSwithEditMode: (state, action) => {
      const { id, value } = action.payload;
      state.currentTaskList.map((t) => {
        if (t.id === id) {
          t.editMode = value !== undefined ? value : true;
        }
        return t;
      });
    },
    deleteTaskList: (state, action) => {
      const listId = action.payload;

      state.currentTaskList = state.currentTaskList.filter(
        (tl) => tl.id !== listId
      );
    },
    addTask: (state, action) => {
      const { listId, task } = action.payload;
      const updatedList = state.currentTaskList.map((tl) => {
        if (tl.id === listId) {
          tl.editMode = false;
          const tasks = tl.tasks?.map((t) => {
            t.editMode = false;
            t.collapsed = true;

            return t;
          });

          tasks?.push({ ...task, editMode: true, collapsed: false });

          tl.tasks = tasks;
        }
        return tl;
      });
      state.currentTaskList = updatedList;
    },

    collapseTask: (state, action) => {
      const { listId, taskId } = action.payload;

      const taskList = state.currentTaskList.find((tl) => tl.id === listId);
      const listIdx = state.currentTaskList.findIndex((tl) => tl.id === listId);

      taskList?.tasks?.map((t) => {
        if (t.id === taskId) {
          t.collapsed = !t.collapsed;
        }
        return t;
      });

      if (taskList) state.currentTaskList[listIdx] = taskList;
    },
    collapseAllTask: (state, action) => {
      const { listId, value } = action.payload;

      const taskList = state.currentTaskList.find((tl) => tl.id === listId);
      const taskListIdx = state.currentTaskList.findIndex(
        (tl) => tl.id === listId
      );

      //collapse all and turn off editmode for all tasks

      taskList?.tasks?.map((t) => {
        t.collapsed = value !== undefined ? value : true;
        t.editMode = false;
        return t;
      });

      if (taskList) state.currentTaskList[taskListIdx] = taskList;
    },

    taskSwitchEditMode: (state, action) => {
      const { listId, id, value } = action.payload;

      state.currentTaskList = state.currentTaskList.map((tl) => {
        if (tl.id === listId) {
          const updatedT = tl.tasks?.map((t) => {
            if (t.id === id) {
              t.editMode = value !== undefined ? value : true;
            }
            return t;
          });
          tl.tasks = updatedT;
        }
        return tl;
      });
    },

    saveTask: (state, action) => {
      const { listId, id, title, description } = action.payload;

      const updatedTaskList = state.currentTaskList.map((tl) => {
        if (tl.id === listId) {
          const updatedTasks = tl?.tasks?.map((t) => {
            if (t.id === id) {
              t = { ...t, title, description, editMode: false };
            }
            return t;
          });
          tl.tasks = updatedTasks;
        }
        return tl;
      });
      state.currentTaskList = updatedTaskList;
    },

    setTaskListTasks: (state, action) => {
      const { listId, tasks } = action.payload;

      const taskList = state.currentTaskList.map((tl) => {
        if (tl.id === listId) {
          tl.tasks = tasks;
        }
        return tl;
      });
      state.currentTaskList = taskList;
    },

    deleteTask: (state, action) => {
      const { listId, id } = action.payload;

      const updatedTaskList = state.currentTaskList.map((tl) => {
        if (tl.id === listId) {
          tl.tasks = tl.tasks?.filter((t) => t.id != id);
        }
        return tl;
      });

      state.currentTaskList = updatedTaskList;
    },
  },
});
export const {
  setTaskList,
  addTaskList,
  saveTaskListTitle,
  taskListSwithEditMode,
  deleteTaskList,
  addTask,
  collapseTask,
  collapseAllTask,
  taskSwitchEditMode,
  saveTask,
  setTaskListTasks,
  deleteTask,
} = taskListSlice.actions;
export default taskListSlice.reducer;
