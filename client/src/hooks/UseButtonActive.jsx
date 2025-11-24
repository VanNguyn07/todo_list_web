import React, { useState } from "react";
import {buttonClickHandles} from "../components/button/ButtonHandleOnClick";

export const useButtonActive = (defaultView = "home") => {
  const [activeView, setActiveView] = useState(defaultView);

  const handleTransitionPage = (viewName) => {
    // kiểm tra danh sách trong buttonClickHandles có hàm nào tên là home không 
    if(buttonClickHandles[viewName]){
      buttonClickHandles[viewName]();
    }else {
      console.warn(`Không tìm thấy xử lý cho: ${viewName}`);
    }
    setActiveView(viewName);
  };
  return {
    activeView,
    handleTransitionPage
  };
};
