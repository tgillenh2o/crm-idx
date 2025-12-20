const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    const res = await axios.post(
      "https://crm-idx.onrender.com/api/auth/login",
      form
    );

    localStorage.setItem("token", res.data.token); // only token

    // fetch role from /me after login
    const me = await axios.get(
      "https://crm-idx.onrender.com/api/auth/me",
      { headers: { Authorization: `Bearer ${res.data.token}` } }
    );

    if (me.data.role === "teamAdmin") {
      navigate("/dashboard/admin");
    } else {
      navigate("/dashboard/member");
    }
  } catch (err) {
    console.error(err.response?.data || err.message);
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};
