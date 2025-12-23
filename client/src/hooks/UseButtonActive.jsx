import React, { useState } from "react";
import {buttonClickHandles} from "../components/button/ButtonHandleOnClick";

export const useButtonActive = (defaultView = "home") => {
  const [activeView, setActiveView] = useState(defaultView);
  const [activeTaskId, setActiveTaskId] = useState(null); // Lưu ID task được chọn
  const [activeTitleTask, setActiveTitleTask] = useState("");

  const handleTransitionPage = (viewName, idTask, titleTask) => {
    // kiểm tra danh sách trong buttonClickHandles có hàm nào tên là home không 
    if(buttonClickHandles[viewName]){
      buttonClickHandles[viewName]();
    }else {
      console.warn(`Không tìm thấy xử lý cho: ${viewName}`);
    }
    setActiveView(viewName);
    setActiveTitleTask(titleTask || "");

    if(idTask){
      setActiveTaskId(idTask);
    }else {
      console.log("error")
      setActiveTaskId(null);
    }

  };
  return {
    activeView,
    activeTaskId,
    activeTitleTask,
    handleTransitionPage
  };
};
