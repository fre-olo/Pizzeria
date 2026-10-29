import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import BookingDemo from "./booking/BookingDemo";
import AdminPanel from "./admin/AdminPanel";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {window.location.pathname === "/admin" ? (
      <AdminPanel />
    ) : window.location.pathname === "/bokning-test" ? (
      <BookingDemo />
    ) : (
      <App />
    )}
  </StrictMode>,
);
