import { StrictMode } from "react";
import {createRoot} from 'react-dom/client';
import Contact from "./pages/contact/contact";
import Dashboard from "./pages/dashboard/Dashboard";

createRoot(document.getElementById('root')).render (
    <StrictMode>
          <Dashboard />
          {/* <Contact></Contact> */}
    </StrictMode>,
)

console.log(import.meta.env.DEV);