import { useState, useEffect, useRef, useCallback } from "react";

const MODES = {
  FOCUS: { time: 25 * 60, label: "Focus Time" },
  SHORT_BREAK: { time: 5 * 60, label: "Short Break" },
};

export const usePomodoroPages = () => {
  // KHỞI TẠO STATE TỪ LOCAL STORAGE
  // Để khi chuyển view quay lại, nó tự lấy dữ liệu cũ lên
  const [mode, setMode] = useState(() => localStorage.getItem("pomo_mode") || "FOCUS");
  
  const [isActive, setActive] = useState(() => {
    // Kiểm tra xem có đang chạy dở không
    return localStorage.getItem("pomo_isRunning") === "true";
  });

  const [timeLeft, setTimeLeft] = useState(() => {
    const savedEndTime = localStorage.getItem("pomo_endTime");
    const savedIsRunning = localStorage.getItem("pomo_isRunning") === "true";
    const savedMode = localStorage.getItem("pomo_mode") || "FOCUS";

    // Trường hợp 1: Đang chạy mà chuyển view/tab -> Tính lại thời gian còn lại thực tế
    if (savedIsRunning && savedEndTime) {
      const now = Date.now();
      const distance = parseInt(savedEndTime, 10) - now;
      if (distance > 0) {
        return Math.ceil(distance / 1000);
      } else {
        return 0; // Đã hết giờ trong lúc chuyển view
      }
    }
    
    // Trường hợp 2: Đang Pause -> Lấy thời gian lúc pause đã lưu
    const savedTimeLeft = localStorage.getItem("pomo_timeLeft");
    if (savedTimeLeft) {
      return parseInt(savedTimeLeft, 10);
    }

    // Trường hợp 3: Mới tinh
    return MODES[savedMode].time;
  });

  // Các state khác (không cần lưu storage cũng được, hoặc tùy bạn)
  const [volumes, setVolumes] = useState({ rain: 50, lofi: 30 });
  const [sessionsCompleted, setSessionsCompleted] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [breaksTaken, setBreaksTaken] = useState(0);
  const [currentTask, setCurrentTask] = useState("");

  const audioRef = useRef(null);
  const bgInputRef = useRef(null);
  const audioInputRef = useRef(null);

  // Lưu Mode mỗi khi thay đổi
  useEffect(() => {
    localStorage.setItem("pomo_mode", mode);
  }, [mode]);

  // Xử lý khi hết giờ
  const handleTimerCompleted = useCallback(() => {
    setActive(false);
    localStorage.setItem("pomo_isRunning", "false");
    localStorage.removeItem("pomo_endTime"); // Xóa mốc thời gian

    if (mode === "FOCUS") {
      setSessionsCompleted((prev) => prev + 1);
      
      // Chuyển sang Short Break
      const nextMode = "SHORT_BREAK";
      setMode(nextMode);
      const nextTime = MODES.SHORT_BREAK.time;
      setTimeLeft(nextTime);
      setBreaksTaken((prev) => prev + 1);
      
      // Lưu trạng thái mới vào storage để F5 không mất
      localStorage.setItem("pomo_mode", nextMode);
      localStorage.setItem("pomo_timeLeft", nextTime.toString());
    } else {
      // Quay lại Focus
      const nextMode = "FOCUS";
      setMode(nextMode);
      const nextTime = MODES.FOCUS.time;
      setTimeLeft(nextTime);
      localStorage.setItem("pomo_mode", nextMode);
      localStorage.setItem("pomo_timeLeft", nextTime.toString());
    }
  }, [mode]);

  // EFFECT CHÍNH: ĐẾM NGƯỢC
  useEffect(() => {
    let interval = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        // Lấy mốc thời gian đích từ storage ra để so sánh
        const endTimeStr = localStorage.getItem("pomo_endTime");
        
        if (endTimeStr) {
          const now = Date.now();
          const distance = parseInt(endTimeStr, 10) - now;
          const secondsLeft = Math.ceil(distance / 1000);

          if (secondsLeft <= 0) {
            setTimeLeft(0);
            handleTimerCompleted();
            clearInterval(interval);
          } else {
            // Cập nhật thời gian hiển thị
            const delta = timeLeft - secondsLeft;
            setTimeLeft(secondsLeft);
            // Lưu cập nhật này vào storage phòng trường hợp user pause ngay sau đó
            localStorage.setItem("pomo_timeLeft", secondsLeft.toString());

            if (delta > 0 && mode === "FOCUS") {
               setTotalMinutes((prev) => prev + delta / 60);
            }
          }
        }
      }, 200); // Check mỗi 200ms
    } else if (timeLeft === 0 && isActive) {
        handleTimerCompleted();
    }

    return () => clearInterval(interval);
  }, [isActive, mode, timeLeft, handleTimerCompleted]);

  // --- CÁC HÀM ĐIỀU KHIỂN ---

  const startTimer = () => {
    if (!isActive) {
      const now = Date.now();
      // Tính mốc thời gian đích dựa trên số giây đang có
      const endTime = now + timeLeft * 1000;
      
      // Lưu vào Storage
      localStorage.setItem("pomo_endTime", endTime.toString());
      localStorage.setItem("pomo_isRunning", "true");
      
      setActive(true);
    }
  };

  const pauseTimer = () => {
    setActive(false);
    localStorage.setItem("pomo_isRunning", "false");
    localStorage.removeItem("pomo_endTime"); // Xóa đích đến vì đã dừng
    localStorage.setItem("pomo_timeLeft", timeLeft.toString()); // Lưu lại số giây đang dừng
  };

  const skipTimer = () => {
    setActive(false);
    localStorage.setItem("pomo_isRunning", "false");
    localStorage.removeItem("pomo_endTime");

    if (mode === "FOCUS") {
      setMode("SHORT_BREAK");
      setTimeLeft(MODES.SHORT_BREAK.time);
      localStorage.setItem("pomo_mode", "SHORT_BREAK");
      localStorage.setItem("pomo_timeLeft", MODES.SHORT_BREAK.time.toString());
    } else {
      setMode("FOCUS");
      setTimeLeft(MODES.FOCUS.time);
      localStorage.setItem("pomo_mode", "FOCUS");
      localStorage.setItem("pomo_timeLeft", MODES.FOCUS.time.toString());
    }
  };

  const resetTimer = () => {
    setActive(false);
    const defaultTime = MODES[mode].time;
    setTimeLeft(defaultTime);
    
    // Xóa sạch storage liên quan timer
    localStorage.setItem("pomo_isRunning", "false");
    localStorage.removeItem("pomo_endTime");
    localStorage.setItem("pomo_timeLeft", defaultTime.toString());
  };

  // --- CÁC HÀM UI ---
  const handleChange = (e) => setCurrentTask(e.target.value);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const circumference = 2 * Math.PI * 140;
  const totalTimer = MODES[mode].time;
  const progressOffset = totalTimer > 0 
    ? circumference - (timeLeft / totalTimer) * circumference 
    : 0;

  const handleVolumeChange = (sound, value) =>
    setVolumes((prev) => ({ ...prev, [sound]: value }));

  const handleBgUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      document.documentElement.style.setProperty("--uploaded-bg", `url(${url})`);
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
    handleVolumeChange,
  };
};