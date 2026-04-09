import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminLogin.css";

export default function AdminLogin() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {

    if (!email || !password) {
      alert("Enter all fields");
      return;
    }

    try {
      const res = await fetch("http://127.0.0.1:8000/api/admin-login/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      localStorage.setItem("adminToken", data.token);

      navigate("/admin-dashboard");

    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="admin-login-page">

      <div className="login-card">

        <h2>Admin Login</h2>

        <input
          type="text"
          placeholder="Admin Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>
          Login
        </button>

      </div>

    </div>
  );
}