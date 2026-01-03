import React from "react";
import { useHabitForm } from "./useHabitForm";
import { useState } from "react";
export const useHabitManager = ({ onSuccess, setHabits }) => {
  const {
    habitForm,
    resetForm,
    setFormData,
    setHabitForm,
    handleChangeIconMap,
    handleChangePeriod,
    handleChangeUnit,
    handleChangetarget,
    handleInputChange,
  } = useHabitForm();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const openCreateModal = () => {
    setEditingId(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (habitData) => {
    setEditingId(habitData.id);
    setFormData(habitData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleAddHabit = async () => {
    if (!habitForm.name.trim()) {
      alert("Please enter a name habit!");
      return;
    }
    if (!habitForm.target) {
      alert("Please set up target!");
      return;
    }

    if (!habitForm.unit) {
      alert("Please select a unit for habit!");
      return;
    }

    const formData = new FormData();
    formData.append("action", "add_habit");
    formData.append("name", habitForm.name.trim());
    formData.append("period", habitForm.period);
    formData.append("target", habitForm.target);
    formData.append("unit", habitForm.unit);
    formData.append("iconKey", habitForm.iconKey);
    formData.append("completed", habitForm.completed);

    console.log("Dữ liệu habit gửi đi:", Object.fromEntries(formData));
    try {
      const response = await fetch("/api/habitApi.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        closeModal();
        resetForm();
        if (onSuccess) onSuccess(); // call refetch()
      } else {
        alert(data.message) || "add don't successfully";
      }
    } catch (er) {
      console.error("Lỗi khi thêm habit:", er);
      alert("Lỗi kết nối. Vui lòng thử lại.");
    }
  };

  const handleDeleteHabit = async (id) => {
    if (!window.confirm("Are your sure want to delete this habit?")) {
      return;
    }

    // resset when delete habit successfully
    if (setHabits) {
      setHabits((prev) => prev.filter((habit) => habit.id !== id));
    }

    const formData = new FormData();
    formData.append("action", "delete_habit");
    formData.append("id", id);

    console.log("Dữ liệu xóa habit gửi đi:", Object.fromEntries(formData));

    try {
      const response = await fetch("/api/habitApi.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        console.log(data.message);
      } else {
        console.log(data.message);
      }
    } catch (er) {
      console.error("Lỗi khi xóa habit:", er);
      alert("Lỗi kết nối. Vui lòng thử lại.");
    }
  };

  const handleUpdateHabit = async (id) => {
    const formData = new FormData();
    formData.append("action", "update_habit");
    formData.append("id", id);
    formData.append("name", habitForm.name.trim());
    formData.append("period", habitForm.period);
    formData.append("target", habitForm.target);
    formData.append("unit", habitForm.unit);
    formData.append("iconKey", habitForm.iconKey);

    console.log("Dữ liệu update habit gửi đi:", Object.fromEntries(formData));

    try {
      const response = await fetch("/api/habitApi.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        closeModal();
        resetForm();
        if (onSuccess) onSuccess();
      } else {
        alert(data.message) || "Update don't successfully";
      }
    } catch (er) {
      console.error("Lỗi khi update habit:", er);
      alert("Lỗi kết nối. Vui lòng thử lại.");
    }
  };

  const handleSubmit = async () => {
   try {
    if(editingId) {
      await handleUpdateHabit(editingId);
    }else {
      await handleAddHabit();
    }
   }catch (error) {
      console.log("Error when save ", error);
    }
  };

  return {
    handleChangeIconMap,
    handleChangePeriod,
    handleChangeUnit,
    handleChangetarget,
    handleInputChange,
    isModalOpen,
    editingId,
    habitForm,
    setHabitForm,
    openEditModal,
    openCreateModal,
    closeModal,
    handleDeleteHabit,
    handleSubmit,
    resetForm,
  };
};
