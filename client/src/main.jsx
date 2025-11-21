import { StrictMode } from "react";
import {createRoot} from 'react-dom/client';
import App from "./App.jsx";
// import TaskInput from "./components/taskCard/updateTask";

createRoot(document.getElementById('root')).render (
    <StrictMode>
          <App />
          {/* <TaskInput/> */}
    </StrictMode>,
) 

console.log(import.meta.env.DEV);