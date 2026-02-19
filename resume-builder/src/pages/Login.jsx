import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../services/authService";
import "../styles/Login.css";
import loginImage from "../assets/login-illustration.png";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [popup, setPopup] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await loginUser(form);
    login(res.data);

    setForm({ email: "", password: "" });

    setPopup({
      type: "success",
      title: "Login Success!",
      message: "Welcome back 🎉",
    });

  } catch (error) {
    setForm({ email: "", password: "" });

    setPopup({
      type: "error",
      title: "Login Failed!",
      message: "Invalid email or password",
    });
  }
};

  return (
    <div className="login-container">

      {popup && (
  <div className="modal-overlay">
    <div className={`modal-card ${popup.type}`}>

      <div className="modal-icon">
         <span className="icon-symbol">
    {popup.type === "success" ? "✓" : "✕"}
  </span>
      </div>

      <h2>{popup.title}</h2>
      <p>{popup.message}</p>

      <button
        className="modal-btn"
        onClick={() => {
          if (popup.type === "success") {
            navigate("/");
          }
          setPopup(null);
        }}
      >
        OK
      </button>

    </div>
  </div>
)}


      <div className="login-left">
        <form onSubmit={handleSubmit} className="login-card space-y-5">
          <h2 className="text-3xl font-bold text-purple-700">
            Welcome back
          </h2>
          <p className="text-black">Please enter your Credentials</p>

          <div>
            <label className="text-sm font-medium">Email address</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="E-mail or Username"
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="8-Digit Password"
              className="w-full mt-1 p-2 border rounded focus:ring-2 focus:ring-purple-600"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 text-white py-2 rounded hover:bg-purple-800 transition"
          >
            Login
          </button>
        </form>
      </div>

      <div className="login-right hidden md:flex">
        <img src={loginImage} alt="Login Illustration" />
      </div>
    </div>
  );
};

export default Login;
