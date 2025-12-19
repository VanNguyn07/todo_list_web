import React, { useState } from "react";
import { useFetchTasks } from "./useFetchTask";

export const useTaskPages = () => {
  // Lấy dữ liệu từ API. Lưu ý: Model PHP mới sẽ trả về key 'sub_tasks' bên trong mỗi task
  const { tasks, setTasks, refetch } = useFetchTasks("get_all_task_list");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActive, setIsActive] = useState("task-total");

  const handleTransition = (view) => {
    setIsActive(view);
  };

    const filteredTask = tasks?.filter((task) => {
    if(isActive === "task-completed") return task.completed === "true";
    if(isActive === "task-pending") return task.completed === "false";
    return true; // total Task
  }) || [];

  const [formState, setFormState] = useState({
    idTask: "",
    titleTask: "",
    sub_tasks: [], // Tên mới khớp với DB
    categoryTask: "", 
    deadlineTask: new Date(),
    description: "",
  });

  const [subtaskInput, setSubtaskInput] = useState("");

  const handleOpenAddModal = () => {
    setFormState({
      idTask: "",
      titleTask: "",
      sub_tasks: [],
      categoryTask: "",
      deadlineTask: null,
      description: "",
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setFormState({
      idTask: task.idTask,
      titleTask: task.titleTask || "",
      sub_tasks: Array.isArray(task.sub_tasks) ? task.sub_tasks : [],
      categoryTask: task.categoryTask || "",
      deadlineTask: task.deadlineTask ? new Date(task.deadlineTask) : null,
      description: task.description || "",
    });
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleDateChange = (date) => {
    setFormState({ ...formState, deadlineTask: date });
  };

const handleSubtaskNameChange = (id, tempId, value) => {
  const updatedSubs = formState.sub_tasks.map((sub) => {
    const isMatch = id ? sub.idSubTask === id : sub.tempId === tempId;
    return isMatch ? { ...sub, content: value } : sub;
  });
  setFormState({ ...formState, sub_tasks: updatedSubs });
};

  const handleAddSubtask = (e) => {
    if (e.key === "Enter" && subtaskInput.trim()) {
      // Tạo object sub-task mới theo đúng tên cột trong DB
      const newSub = { 
        tempId: Date.now(), // ID tạm thời cho React render
        content: subtaskInput, 
        completed: "false" 
      };
      setFormState({
        ...formState,
        sub_tasks: [...formState.sub_tasks, newSub],
      });
      setSubtaskInput("");
    }
  };

const handleDeleteSubtask = (id, tempId) => {
  setFormState({
    ...formState,
    sub_tasks: formState.sub_tasks.filter((s) => 
      id ? s.idSubTask !== id : s.tempId !== tempId
    ),
  });
};

  const toggleExpand = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.idTask === taskId ? { ...task, expanded: !task.expanded } : task
      )
    );
  };

  return {
    isModalOpen,
    formState,
    setFormState,
    subtaskInput,
    tasks,
    refetch,
    setSubtaskInput,
    handleOpenAddModal,
    handleOpenEditModal,
    closeModal,
    handleDateChange,
    handleInputChange,
    handleAddSubtask,
    handleSubtaskNameChange,
    handleDeleteSubtask,
    toggleExpand,
    isActive,
    handleTransition,
    filteredTask
  };
};