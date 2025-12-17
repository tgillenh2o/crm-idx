import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await api.post("/auth/login", { email, password });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("role", res.data.user.role);

    if (res.data.user.role === "teamAdmin") {
      navigate("/dashboard/admin");
    } else {
      navigate("/dashboard");
    }
  };
}
