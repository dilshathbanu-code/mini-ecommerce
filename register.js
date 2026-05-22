import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleRegister = async () => {
    try {
      await axios.post("https://mini-ecommerce-cd3l.onrender.com/register", { name, email, password });
      setMessage("Registered successfully! Please login.");
      setTimeout(() => router.push("/"), 2000);
    } catch (err) {
      setMessage("User already exists!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <input className="w-full border p-2 mb-4 rounded" type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="w-full border p-2 mb-4 rounded" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="w-full border p-2 mb-4 rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600" onClick={handleRegister}>Register</button>
        {message && <p className="mt-4 text-center text-green-600">{message}</p>}
        <p className="mt-4 text-center">Already have an account? <a href="/" className="text-blue-500">Login</a></p>
      </div>
    </div>
  );
}