import React, { useEffect, useState } from "react";
// define an object by writing is const name_object = {}
const MODES = {
  FOCUS: { time: 25 * 60, label: "Focus Time" },
  SHORT_BREAK: { time: 5 * 60, label: "Short Break Time" },
};

export const usePomodoro = () => {
  const [mode, setMode] = useState("FOCUS");
  const [isActive, setIsActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MODES.FOCUS.time);

  // useEffect is người dám sát
  //useEffect(hàm thực thi, [các giá trị cần theo dõi])
  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeCurrent) => timeCurrent - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === "FOCUS") {
        setMode("SHORT_BREAK");
        setTimeLeft(MODES.SHORT_BREAK.time);
      } else {
        setMode("FOCUS");
        setTimeLeft(MODES.FOCUS.time);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const startPlay = () => setIsActive(true);
  const pausePlay = () => setIsActive(false);

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(MODES[mode].time);
  };

  const skipPlay = () => {
    setIsActive(false);
    const next_mode = mode === "FOCUS" ? "SHORT_BREAK" : "FOCUS";
    setMode(next_mode);
    setTimeLeft(MODES[next_mode].time);
  };

  const formatTime = () => {
    //Math.floor để làm tròn số
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2,"0")}`;
  };

  // Tính toán vòng tròn SVG (Chu vi ~ 283) vì r = 45
  const circumference = 2 * Math.PI * 45;
  const totalTimer = MODES[mode].time;
  const progressOffset =
    circumference - (timeLeft / totalTimer) * circumference;

  return {
    timeLeft,
    isActive,
    mode,
    startPlay,
    pausePlay,
    skipPlay,
    resetTimer,
    formatTime,
    circumference,
    progressOffset,
  };
};
