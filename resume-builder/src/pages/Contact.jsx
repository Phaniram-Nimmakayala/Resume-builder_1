import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Contact.css";

const Contact = () => {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [toast, setToast] = useState({
    message: "",
    type: ""
  });

  const [showToast, setShowToast] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const showNotification = (message, type) => {
    setToast({ message, type });
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      showNotification("Please login before sending a message", "error");

      setTimeout(() => {
        navigate("/login");
      }, 1500);

      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/contact/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData)
        }
      );

      if (response.ok) {
        showNotification("Message sent successfully!", "success");

        setFormData({
          name: "",
          email: "",
          message: ""
        });
      }

    } catch (error) {
      showNotification("Something went wrong!", "error");
    }
  };

  return (
    <section className="contact-section">

      {/* TOAST NOTIFICATION */}
      {showToast && (
        <div className={`contact-toast ${toast.type}`}>
          <div className="toast-icon-wrap">
            {toast.type === "success" ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            )}
          </div>
          <span>{toast.message}</span>
          <div className="toast-progress" />
        </div>
      )}

      {/* Background image */}
      <div className="contact-bg" />

      {/* Dark overlay */}
      <div className="contact-overlay" />

      {/* Decorative elements */}
      <div className="contact-decor" aria-hidden="true">
        <div className="cdecor-ring cr-1" />
        <div className="cdecor-ring cr-2" />
        <div className="cdecor-ring cr-3" />
        <div className="cdecor-dots cd-1" />
        <div className="cdecor-cross cc-1" />
        <div className="cdecor-blur cb-1" />
        <div className="cdecor-blur cb-2" />
      </div>

      {/* Main content */}
      <div className="contact-inner">

        {/* LEFT — Info */}
        <div className="contact-left">
          <div className="cl-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Get In Touch</span>
          </div>

          <h2 className="cl-heading">
            Let's Start a{" "}
            <span className="cl-accent">Conversation</span>
          </h2>

          <p className="cl-sub">
            Have a question, suggestion, or feedback? Send us a message
            and we'll respond as soon as possible. Your input helps us
            improve the experience for everyone.
          </p>

          {/* Contact info cards */}
          <div className="cl-info-cards">
            <div className="cl-info-card">
              <div className="clic-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </div>
              <div>
                <span className="clic-label">Email</span>
                <span className="clic-value">support@resumebuild.com</span>
              </div>
            </div>

            <div className="cl-info-card">
              <div className="clic-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <div>
                <span className="clic-label">Response Time</span>
                <span className="clic-value">Within 24 hours</span>
              </div>
            </div>

            <div className="cl-info-card">
              <div className="clic-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <span className="clic-label">Security</span>
                <span className="clic-value">End-to-end encrypted</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT — Form */}
        <div className="contact-form-box">
          <div className="cfb-glow" />

          <h3 className="cfb-title">Send a Message</h3>
          <p className="cfb-sub">We'd love to hear from you</p>

          <form onSubmit={handleSubmit}>
            {/* Name input */}
            <div className="cfb-field">
              <label htmlFor="name" className="cfb-label">Your Name</label>
              <div className="cfb-input-wrap">
                <svg className="cfb-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  id="name"
                  type="text"
                  name="name"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Email input */}
            <div className="cfb-field">
              <label htmlFor="email" className="cfb-label">Email Address</label>
              <div className="cfb-input-wrap">
                <svg className="cfb-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Message textarea */}
            <div className="cfb-field">
              <label htmlFor="message" className="cfb-label">Your Message</label>
              <div className="cfb-input-wrap cfb-textarea-wrap">
                <svg className="cfb-input-icon cfb-textarea-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell us what's on your mind..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Submit button */}
            <button type="submit" className="cfb-submit">
              <span>Send Message</span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </div>

      </div>
    </section>
  );
};

export default Contact;