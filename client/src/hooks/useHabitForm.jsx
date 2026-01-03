import React, { useState } from "react";
export const useHabitForm = () => {
  const defaultValues = {
    name: "",
    period: "Daily",
    target: 1,
    unit: "",
    unitType: "",
    iconKey: "",
    completed: "false",
  };

  const [habitForm, setHabitForm] = useState(defaultValues);

  // Hàm reset form về trắng (Dùng khi bấm Add New)
  const resetForm = () => setHabitForm(defaultValues);

  // Hàm đổ dữ liệu vào form (Dùng khi bấm Edit)
  const setFormData = (data) => {
    setHabitForm({
      name: data.name,
      period: data.period,
      target: Number(data.target), // Map đúng key từ DB
      unit: data.unit,
      iconKey: data.icon_key,
      completed: data.completed,
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setHabitForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChangePeriod = (per) => {
    setHabitForm((prev) => ({
      ...prev,
      period: per,
    }));
  };
  const handleChangeUnit = (unit) => {
    let unitType = "";

    if (["km", "m", "miles"].includes(unit)) {
      unitType = "distance";
    } else if (["mins", "hrs"].includes(unit)) {
      unitType = "time";
    } else {
      unitType = "quantity";
    }

    setHabitForm((prev) => ({
      ...prev,
      unit,
      unitType,
    }));
  };

  const handleChangetarget = (e) => {
    let value = e.target.value;
    if (value === "") {
      setHabitForm((prev) => ({
        ...prev,
        target: "",
      }));
      return;
    }
    value = Number(value);
    if (value < 0) {
      return;
    }
    if (habitForm.unitType == "quantity") {
      value = Math.floor(value);
    }

    setHabitForm((prev) => ({
      ...prev,
      target: value,
    }));
  };

  const handleChangeIconMap = (key) => {
    setHabitForm((prev) => ({
      ...prev,
      iconKey: key,
    }));
  };

  return {
    habitForm,
    resetForm,
    setFormData,
    setHabitForm,
    handleChangeIconMap,
    handleChangePeriod,
    handleChangeUnit,
    handleChangetarget,
    handleInputChange,
  };
};
