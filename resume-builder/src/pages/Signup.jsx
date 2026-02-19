import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";
import "../styles/Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    password: "",
    confirm_password: "",
  });

  const [popup, setPopup] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerUser(form);

      setForm({
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        password: "",
        confirm_password: "",
      });

      setPopup({
        type: "success",
        title: "Registration Successful!",
        message: "Your account has been created 🎉",
      });

    } catch (err) {
      setPopup({
        type: "error",
        title: "Registration Failed!",
        message: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-start justify-center bg-slate-50 pt-40">

      {/* ===== Modal Popup ===== */}
      {popup && (
        <div className="modal-overlay">
          <div className={`modal-card ${popup.type}`}>

            <div className="modal-icon">
              {popup.type === "success" ? "✔" : "✖"}
            </div>

            <h2>{popup.title}</h2>
            <p>{popup.message}</p>

            <button
              className="modal-btn"
              onClick={() => {
                if (popup.type === "success") {
                  navigate("/login");
                }
                setPopup(null);
              }}
            >
              OK
            </button>

          </div>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="signup-card w-full max-w-md"
      >
        <div className="signup-accent"></div>

        <h2 className="text-2xl font-bold text-center text-slate-800">
          Sign Up
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Let's get started with your 30 days free trial
        </p>

        <div className="space-y-4">
          <input name="first_name" placeholder="First name" className="signup-input" value={form.first_name} onChange={handleChange} />
          <input name="last_name" placeholder="Last name" className="signup-input" value={form.last_name} onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" className="signup-input" value={form.email} onChange={handleChange} />
          <input name="mobile" placeholder="Phone number" className="signup-input" value={form.mobile} onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" className="signup-input" value={form.password} onChange={handleChange} />
          <input name="confirm_password" type="password" placeholder="Confirm password" className="signup-input" value={form.confirm_password} onChange={handleChange} />
        </div>

        <button type="submit" className="signup-btn w-full mt-6">
          Sign Up
        </button>

      </form>
    </div>
  );
};

export default Signup;
