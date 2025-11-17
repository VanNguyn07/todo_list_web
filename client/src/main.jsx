import { StrictMode } from "react";
import {createRoot} from 'react-dom/client';
import Contact from "./pages/contact/contact";
import Dashboard from "./pages/dashboard/Dashboard";
import SignIn from "./pages/signInPages/SignIn.jsx";
import App from "./App.jsx";

createRoot(document.getElementById('root')).render (
    <StrictMode>
          {/* <Dashboard /> */}
          {/* <Contact></Contact> */}
          {/* <SignIn /> */}
          <App />
    </StrictMode>,
)

console.log(import.meta.env.DEV);