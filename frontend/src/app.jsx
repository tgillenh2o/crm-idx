import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardRouter from "./routes/DashboardRouter";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard/*" element={<DashboardRouter />} />
    </Routes>
  );
}
