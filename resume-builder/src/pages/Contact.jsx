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
    <div className={`toast ${toast.type}`}>
      {toast.message}
    </div>
  )}

  {/* LEFT TEXT */}

  <div className="contact-left">

    <h2>Contact Me</h2>

    <p>
      Have a question or suggestion? Send us a message and we will
      respond as soon as possible. Your feedback helps us improve
      the experience for everyone.
    </p>

  </div>

  {/* GLASS FORM */}

  <div className="contact-form-box">

    <h3>Send Me A Message</h3>

    <form onSubmit={handleSubmit}>

      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={formData.name}
        onChange={handleChange}
        required
      />

      <input
        type="email"
        name="email"
        placeholder="Email Address"
        value={formData.email}
        onChange={handleChange}
        required
      />

      <textarea
        name="message"
        placeholder="Your Message"
        value={formData.message}
        onChange={handleChange}
        required
      />

      <button type="submit">
        Send Message
      </button>

    </form>

  </div>

</section>


);
};

export default Contact;
