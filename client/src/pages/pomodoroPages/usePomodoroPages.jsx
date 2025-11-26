import React, { useState, useEffect, useRef, useCallback } from "react";

const MODES = {
  FOCUS: { time: 25 * 60, label: "Focus Time" },
  SHORT_BREAK: { time: 5 * 60, label: "Short Break" },
};

export const usePomodoroPages = () => {
  const [mode, setMode] = useState("FOCUS");
  const [isActive, setActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(MODES.FOCUS.time);
  const [volumes, setVolumes] = useState({ rain: 50, lofi: 30 });
  const [sessionsCompleted, setSessionsCompleted] =useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0)
  const [breaksTaken, setBreaksTaken] = useState(0);
  const [currentTask, setCurrentTask] = useState("");


  const audioRef = useRef(null);
  const bgInputRef = useRef(null);
  const audioInputRef = useRef(null);

  const handleChange = (e) => {
    setCurrentTask(e.target.value);
  }

  const handleTimerCompleted =  useCallback(() => {
   setActive(false);
      if (mode === "FOCUS") {
        setSessionsCompleted((prev) => prev + 1);
        setMode("SHORT_BREAK");
        setTimeLeft(MODES.SHORT_BREAK.time);
        setBreaksTaken((prev) => prev + 1);
      } else {
        setMode("FOCUS");
        setTimeLeft(MODES.FOCUS.time);
      }
  }, [mode]);

  useEffect(() => {
    let interval = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((timeCurrent) => timeCurrent - 1);
        if(mode === "FOCUS") setTotalMinutes((prev) => prev + 1 / 60);
      }, 1000);
    } else if (timeLeft === 0) {
        handleTimerCompleted();
    }
    return () => clearInterval(interval);
  }, [isActive, mode, timeLeft, handleTimerCompleted]);

  const startTimer = () => setActive(true);
  const pauseTimer = () => setActive(false);

  const skipTimer = () => {
    setActive(false);
    if (mode === "FOCUS") {
      setMode("SHORT_BREAK");
      setTimeLeft(MODES.SHORT_BREAK.time);
    } else {
      setMode("FOCUS");
      setTimeLeft(MODES.FOCUS.time);
    }
  };

  const resetTimer = () => {
    setActive(false);
    setTimeLeft(MODES[mode].time);
  };

  const formatTime = () => {
    //Math.floor để làm tròn số
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;
  };

  // Tính toán vòng tròn SVG (Chu vi ~ 880) vì r = 140
  const circumference = 2 * Math.PI * 140;
  const totalTimer = MODES[mode].time;
  const progressOffset =
    circumference - (timeLeft / totalTimer) * circumference;
  const handleVolumeChange = (sound, value) =>
    setVolumes((prev) => ({ ...prev, [sound]: value }));

  const handleBgUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      document.documentElement.style.setProperty(
        "--uploaded-bg",
        `url(${url})`
      );
    }
  };

  const handleAudioUpload = (e) => {
    const file = e.target.files?.[0];
    if (file && audioRef.current) {
      const url = URL.createObjectURL(file);
      audioRef.current.src = url;
      audioRef.current.play();
    }
  };
  return {
    isActive,
    progressOffset,
    timeLeft,
    mode,
    circumference,
    bgInputRef,
    audioRef,
    audioInputRef,
    volumes,
    currentTask,
    sessionsCompleted,
    breaksTaken,
    totalMinutes,
    setSessionsCompleted,
    setBreaksTaken,
    handleChange,
    startTimer,
    pauseTimer,
    skipTimer,
    resetTimer,
    formatTime,
    handleAudioUpload,
    handleBgUpload,
    handleVolumeChange
  };
};
