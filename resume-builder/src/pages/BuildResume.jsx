import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import "../styles/BuildResume.css";
import resumeImg from "../assets/res1.png";

export default function BuildResume() {

  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPopup, setShowPopup] = useState(false);

  const handleBuildClick = () => {

    if (!user) {
      setShowPopup(true);

      setTimeout(() => {
        navigate("/login");
      }, 1500);

      return;
    }

    navigate("/resume-options");
  };

  return (
    <section className="build-page">

      <div className="build-container">

        {/* LEFT TEXT */}
        <div className="build-text">
          <h1 className="text-4xl font-bold mb-6">
            Create Your Professional Resume
          </h1>

          <p className="text-lg mb-8 text-gray-600">
            Build a job-winning resume with modern
            ATS-friendly templates in minutes.
          </p>

          <button
            onClick={handleBuildClick}
            className="build-btn"
          >
            Start Building Resume
          </button>
        </div>

        {/* RIGHT IMAGE */}
        <div className="build-image">
          <img src={resumeImg} alt="Resume preview" />
        </div>

      </div>


      {/* LOGIN POPUP */}
      {showPopup && (
        <div className="login-popup">
          Please login to start building your resume
        </div>
      )}

    </section>
  );
}