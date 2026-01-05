import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css";
// import App from "./App.jsx";
import AdminDashboard from "./pages/admin/app/page";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      {/* <App /> */}
      <AdminDashboard />
    </BrowserRouter>
  </StrictMode>
);

console.log(import.meta.env.DEV);
