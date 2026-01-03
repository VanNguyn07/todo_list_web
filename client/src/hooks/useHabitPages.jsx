import React from "react";
import { useFetchHabit } from "./useFetchHabit";
import confetti from "canvas-confetti";
import { useHabitManager } from "./useHabitManager";

export const useHabitPages = () => {
  const { habits, refetch, setHabits } = useFetchHabit();
  const manager = useHabitManager({ onSuccess: refetch, setHabits: setHabits });
  console.log("Manager data inside useHabitPages:", manager);

  // Xử lý nút bấm tăng
  const handleIncrement = async (id) => {
    const targetHabit = habits.find((habit) => habit.id === id);
    if (!targetHabit) return;

    const currentValue = parseFloat(targetHabit.current);
    const targetValue = parseFloat(targetHabit.target);
    let nextValue = currentValue + 1;
    // toFixed(2) giữ lại 2 số thập phân, sau đó parseFloat để bỏ số 0 thừa (vd: 5.00 -> 5)
    nextValue = parseFloat(nextValue.toFixed(2));
    const newCurrent = Math.min(nextValue, targetValue);
    const isDone = newCurrent >= targetValue;

    if (isDone && targetHabit.completed === "false") {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#4690ff", "#ff5c72"],
      });
    }

    setHabits(
      habits.map((habit) => {
        if (habit.id === id) {
          return {
            ...habit,
            current: newCurrent,
            completed: isDone ? "true" : "false",
          };
        }
        return habit;
      })
    );

    try {
      const formData = new FormData();
      formData.append("action", "is_completed");
      formData.append("id", id);
      formData.append("current", newCurrent);
      formData.append("completed", isDone ? "true" : "false");
      console.log("Dữ liệu gửi đi:", Object.fromEntries(formData));

      const response = await fetch("/api/habitApi.php", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        console.log("Update status is success");
      } else {
        throw new Error(data.message || "Update status completed for habit is failed");
      }
    } catch (er) {
      console.error("Lỗi khi thêm habit:", er);
      alert("Lỗi kết nối. Vui lòng thử lại.");
    }
  };
  // Định nghĩa màu mặc định cho từng loại icon
  const iconColorMap = {
    run: "#f97316", // Cam (Chạy bộ)
    water: "#3b82f6", // Xanh dương (Uống nước)
    book: "#8b5cf6", // Tím (Đọc sách)
    sleep: "#475569", // Xám đậm (Ngủ)
    gym: "#ef4444", // Đỏ (Gym)
    sport: "#f59e0b", // Vàng (Thể thao)
    food: "#10b981", // Xanh lá (Ăn uống)
    work: "#0ea5e9", // Xanh trời (Công việc)
    music: "#ec4899", // Hồng (Nhạc)
    default: "#6b7280", // Màu mặc định nếu không tìm thấy key
  };

  return {
    ...manager,
    habits,
    iconColorMap,
    refetch,
    handleIncrement,
  };
};
