import { StrictMode } from "react";
import {createRoot} from 'react-dom/client';
// import App from "./App.jsx";
import { UpdateTask } from "./components/taskCard/updateTask";

createRoot(document.getElementById('root')).render (
    <StrictMode>
          {/* <App />   */}
          <UpdateTask/>
    </StrictMode>,
) 

console.log(import.meta.env.DEV);