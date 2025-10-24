import { useState } from "react";
import { auth } from "../api";

export default function Register() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { name, email, password } = e.target.elements;
    try {
      const res = await auth.register({ name: name.value, email: email.value, password: password.value });
      setMessage(res.message);
    } catch (err) {
      setMessage(err.message);
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Register</h2>
      {message && <div>{message}</div>}
      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" />
        <input name="email" placeholder="Email" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit" disabled={loading}>Register</button>
      </form>
    </div>
  );
}
