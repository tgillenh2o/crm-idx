import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function LoginPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const toggleDarkMode = () => setDarkMode(!darkMode);
  const toggleForm = () => setIsRegister(!isRegister);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isRegister ? "/api/auth/register" : "/api/auth/login";
      const { data } = await axios.post(endpoint, formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center transition-all duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full border hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
      </div>

      <div
        className={`w-full max-w-md p-8 rounded-2xl shadow-lg border ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <input
                type="text"
                name="name"
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-gray-50 border-gray-300 text-gray-900"
                }`}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-gray-50 border-gray-300 text-gray-900"
              }`}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm">
            {isRegister ? "Already have an account?" : "Don’t have an account?"}
          </p>
          <button
            onClick={toggleForm}
            className="text-indigo-500 font-medium hover:underline"
          >
            {isRegister ? "Login" : "Register"}
          </button>
        </div>
      </div>
    </div>
  );
}
