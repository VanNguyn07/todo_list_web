import React, { useState } from "react";
export const useCalendarForm = () => {
  const defaultValues = {
    name: "",
    startTime: "09:00",
    endTime: "10:00",
    description: "",
    completed: "false",
    color: "#6366f1",
    date: new Date(),
  };

  const [calForm, setCalForm] = useState(defaultValues);

  const resetForm = () => setFormData(defaultValues);

  // Hàm đổ dữ liệu vào form (Dùng khi bấm Edit)
  const setFormData = (data) => {
    setCalForm({
      name: data.name,
      startTime: data.startTime
        ? data.startTime.substring(0, 5)
        : data.startTime,
      endTime: data.endTime ? data.endTime.substring(0, 5) : data.endTime,
      description: data.description,
      color: data.color,
      // Đảm bảo date là Date Object
      date:
        typeof data.date === "string"
          ? new Date(data.date)
          : data.date || data.date,
      completed: data.completed,
    });
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;
    setCalForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangeColor = (color) => {
    setCalForm((prev) => ({
      ...prev,
      color: color,
    }));
  };

  return {
    calForm,
    setCalForm,
    setFormData,
    handleChangeColor,
    handleChangeInput,
    resetForm,
  };
};
