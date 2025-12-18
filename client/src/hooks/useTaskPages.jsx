import React, { useState } from "react";
import { useFetchTasks } from "./useFetchTask";
export const useTaskPages = () => {
  const { tasks, setTasks, refetch } = useFetchTasks("get_all_task_list");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isActive, setIsACtive] = useState("task-total");

  const handleTransition = (view) => {
    setIsACtive(view);
  }

  const filteredTask = tasks?.filter((task) => {
    if(isActive === "task-completed") return task.completed === true;
    if(isActive === "task-pending") return task.completed === false;
    return true; // total Task
  }) || [];

  const [formState, setFormState] = useState({
    idTask: "",
    titleTask: "",
    detailTask: [],
    categoryTask: "", 
    deadlineTask: new Date(),
    description: "",
  });

  const [subtaskInput, setSubtaskInput] = useState("");

  const handleOpenAddModal = () => {
    setFormState({
      idTask: "",
      titleTask: "",
      detailTask: [],
      categoryTask: "",
      deadlineTask: null,
      description: "",
    });
    setIsModalOpen(true);
  };

  
  const handleOpenEditModal = (task) => {
    setFormState({
      // sao chép các field, nhưng ép deadlineTask thành Date hoặc null
      idTask: task.idTask,
      titleTask: task.titleTask || "",
      detailTask: Array.isArray(task.detailTask)
        ? task.detailTask
        : task.detailTask
        ? JSON.parse(task.detailTask)
        : [],
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

  const handleSubtaskNameChange = (id, value) => {
    const updatedSubs = formState.detailTask.map((subtask) =>
      subtask.id === id ? { ...subtask, title: value } : subtask
    );
    setFormState({ ...formState, detailTask: updatedSubs });
  };

  // Hàm giả thêm subtask (Enter)
  const handleAddSubtask = (e) => {
    if (e.key === "Enter" && subtaskInput.trim()) {
      const newSub = { id: Date.now(), title: subtaskInput, completed: false };
      setFormState({
        ...formState,
        detailTask: [...formState.detailTask, newSub],
      });
      setSubtaskInput("");
    }
  };

  // Hàm giả xóa subtask
  const handleDeleteSubtask = (id) => {
    setFormState({
      ...formState,
      detailTask: formState.detailTask.filter((s) => s.id !== id),
    });
  };

  // --- Logic Đóng/Mở chi tiết Task ---
  const toggleExpand = (taskId) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        // Nếu đúng ID thì đảo ngược trạng thái expanded (true -> false, false -> true)
        task.idTask === taskId ? { ...task, expanded: !task.expanded } : task
      )
    );
  };
  return {
    isModalOpen,
    formState,
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
