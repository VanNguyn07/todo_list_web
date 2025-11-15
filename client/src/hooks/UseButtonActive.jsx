import React, { useState } from "react";
import {buttonClickHandles} from "../components/button/ButtonHandleOnClick";

export const UseButtonActive = (defaultView = "home") => {
  const [activeView, setActiveView] = useState(defaultView);

  const handleViewChange = (viewName) => {
    if(buttonClickHandles[viewName]){
      buttonClickHandles[viewName]();
    }else {
      console.warn(`Không tìm thấy xử lý cho: ${viewName}`);
    }
    setActiveView(viewName);
  };
  return {
    activeView,
    handleViewChange
  };
};
