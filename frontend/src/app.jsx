import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <AuthProvider>
      <div className="app-container">
        <Login />
        <Register />
      </div>
    </AuthProvider>
  );
}
