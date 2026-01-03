import React, { useState } from "react";
import { useCalendarForm } from "./useCalendarForm";
import { format } from "date-fns";
import { useFetchEvent } from "./useFetchCalendar";
export const useCalendarManager = ({ onSuccess, date }) => {
  const {
    calForm,
    setCalForm,
    setFormData,
    handleChangeColor,
    handleChangeInput,
    resetForm,
  } = useCalendarForm();

  const { events, setEvents } = useFetchEvent();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const openAddModal = () => {
    setEditingId(null);
    resetForm();
    setIsModalOpen(true);
  };

  const openUpdateModal = (eventData) => {
    setEditingId(eventData.id);
    setFormData(eventData);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleToggleEvent = async (id) => {
    const eventToUpdate = events.find((e) => e.id == id);
    if (!eventToUpdate) return;

    const newStatus = !eventToUpdate.completed;

    setEvents((prevEvents) =>
      prevEvents.map((e) => (e.id == id ? { ...e, completed: newStatus } : e))
    );

    try {
      const formData = new FormData();
      formData.append("action", "is_completed");
      formData.append("id", id);
      formData.append("completed", newStatus ? "true" : "false");

      const response = await fetch("/api/calendarApi.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        console.log("Update status is success");
        if (onSuccess) onSuccess();
      } else {
        throw new Error(
          data.message || "Update status completed for habit is failed"
        );
      }
    } catch (er) {
      console.error("Lỗi khi thêm habit:", er);
      alert("Lỗi kết nối. Vui lòng thử lại.");
    }
  };

  const colors = ["#6366f1", "#10b981", "#ef4444", "#f59e0b", "#8b5cf6"];

  const handleAddEvent = async (selectedDate) => {
    if (!calForm.name.trim()) {
      alert("Please enter a Event Title!");
      return;
    }

    if (!calForm.startTime || !calForm.endTime) {
      alert("Please enter start and end time!");
      return;
    }

    const formattedDate = format(selectedDate, "yyyy-MM-dd");

    const formData = new FormData();
    formData.append("action", "add_event");
    formData.append("name", calForm.name);
    formData.append("startTime", calForm.startTime);
    formData.append("endTime", calForm.endTime);
    formData.append("description", calForm.description);
    formData.append("completed", calForm.completed);
    formData.append("color", calForm.color);
    formData.append("date", formattedDate);

    console.log("Data event send: ", Object.fromEntries(formData));

    try {
      const response = await fetch("/api/calendarApi.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        closeModal();
        resetForm();
        if (onSuccess) onSuccess();
      } else {
        alert(data.message) || "Add event is not successfully";
      }
    } catch (er) {
      console.error("Lỗi khi thêm event:", er);
      alert("Lỗi kết nối. Vui lòng thử lại.");
    }
  };

  const handleDeleteEvent = async (id) => {
    if (!window.confirm("Are your sure want to delete this event?")) {
      return;
    }

    if (setEvents) {
      setEvents((prev) => prev.filter((event) => event.id !== id));
    }
    const formData = new FormData();
    formData.append("action", "delete_event");
    formData.append("id", id);

    console.log("Dữ liệu xóa event gửi đi:", Object.fromEntries(formData));

    try {
      const response = await fetch("/api/calendarApi.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        console.log(data.message);
        if (onSuccess) onSuccess();
      } else {
        console.log(data.message);
      }
    } catch (er) {
      console.error("Lỗi khi xóa habit:", er);
      alert("Lỗi kết nối. Vui lòng thử lại.");
    }
  };

  const handleUpdateEvent = async (id) => {
    const formData = new FormData();
    formData.append("action", "update_event");
    formData.append("id", id);
    formData.append("name", calForm.name.trim());
    formData.append("description", calForm.description);
    formData.append("startTime", calForm.startTime);
    formData.append("endTime", calForm.endTime);

    console.log("Dữ liệu update event gửi đi:", Object.fromEntries(formData));

    try {
      const response = await fetch("/api/calendarApi.php", {
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
        if(editingId){
            await handleUpdateEvent(editingId);
        }else {
            await handleAddEvent(date);
        }
    }catch (error) {
      console.log("Error when save ", error);
    }
  }
  return {
    handleChangeColor,
    handleChangeInput,
    handleToggleEvent,
    handleDeleteEvent,
    handleSubmit,
    isModalOpen,
    editingId,
    calForm,
    colors,
    setCalForm,
    openAddModal,
    openUpdateModal,
    closeModal,
  };
};
