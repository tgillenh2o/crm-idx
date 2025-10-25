import React, { useState } from "react";
import axios from "axios";
export default function Register() {
const [name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const handleSubmit = async (e) => {
e.preventDefault();
try {
const res = await axios.post(${import.meta.env.VITE_API_URL}/api/auth/register, {
name,
email,
password,
});
alert("Registration successful! Please check your email for confirmation.");
console.log(res.data);
} catch (err) {
console.error(err);
alert("Registration failed. Please try again.");
}
};
return (
<div className="min-h-screen flex items-center justify-center bg-gray-900">
<div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
<h2 className="text-2xl font-bold text-white mb-6 text-center">Register</h2>
<form onSubmit={handleSubmit}>
<div className="mb-4">
<label className="block text-gray-300 mb-2">Name</label>
<input
type="text"
className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
value={name}
onChange={(e) => setName(e.target.value)}
required
/>
</div>
<div className="mb-4">
<label className="block text-gray-300 mb-2">Email</label>
<input
type="email"
className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
value={email}
onChange={(e) => setEmail(e.target.value)}
required
/>
</div>
<div className="mb-6">
<label className="block text-gray-300 mb-2">Password</label>
<input
type="password"
className="w-full p-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
value={password}
onChange={(e) => setPassword(e.target.value)}
required
/>
</div>
<button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition-colors" >
Register
</button>
</form>
</div>
</div>
);
}