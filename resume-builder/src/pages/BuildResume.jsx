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

      {/* Decorative background */}
      <div className="build-decor" aria-hidden="true">
        <div className="build-blur bb-1" />
        <div className="build-blur bb-2" />
        <div className="build-blur bb-3" />
        <div className="build-grid-lines" />
      </div>

      <div className="build-container">

        {/* Left — Text content */}
        <div className="build-text-col">

          <div className="build-eyebrow">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span>Quick & Easy</span>
          </div>

          <h1 className="build-heading">
            Create Your{" "}
            <span className="build-accent">
              Professional Resume
              <svg
                className="build-squiggle"
                viewBox="0 0 240 12"
                fill="none"
                preserveAspectRatio="none"
              >
                <path
                  d="M3 8 C40 3, 80 3, 120 6 S200 11, 237 4"
                  stroke="url(#buildGrad)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient
                    id="buildGrad"
                    x1="0"
                    y1="0"
                    x2="240"
                    y2="0"
                  >
                    <stop offset="0%" stopColor="#a78bfa" />
                    <stop offset="100%" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          <p className="build-sub">
            Build a job-winning resume with modern ATS-friendly templates
            in minutes. Stand out from the crowd and land your dream
            interview.
          </p>

          {/* Feature pills */}
          <div className="build-pills">
            <div className="bpill">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>ATS Friendly</span>
            </div>
            <div className="bpill">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="9" y1="21" x2="9" y2="9" />
              </svg>
              <span>30+ Templates</span>
            </div>
            <div className="bpill">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              <span>PDF Export</span>
            </div>
          </div>

          <button onClick={handleBuildClick} className="build-btn">
            <span>Start Building Resume</span>
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>

          {/* Micro stats */}
          <div className="build-micro-stats">
            <div className="bms-item">
              <span className="bms-val">2 min</span>
              <span className="bms-lbl">Avg. build time</span>
            </div>
            <div className="bms-sep" />
            <div className="bms-item">
              <span className="bms-val">Free</span>
              <span className="bms-lbl">No hidden cost</span>
            </div>
            <div className="bms-sep" />
            <div className="bms-item">
              <span className="bms-val">∞</span>
              <span className="bms-lbl">Unlimited edits</span>
            </div>
          </div>
        </div>

        {/* Right — Image */}
        <div className="build-image-col">
          <div className="build-img-frame">
            <div className="bif-glow" />
            <div className="bif-border" />
            <img src={resumeImg} alt="Resume preview" loading="lazy" />
            <div className="bif-shine" />
          </div>

          {/* Floating badges */}
          <div className="build-float bf-1">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#10b981"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
            <span>Secure Data</span>
          </div>

          <div className="build-float bf-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#7c3aed"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span>PDF Ready</span>
          </div>

          <div className="build-float bf-3">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>Fast Build</span>
          </div>
        </div>

      </div>

      {/* Login popup toast */}
      {showPopup && (
        <div className="login-popup">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
            <polyline points="10 17 15 12 10 7" />
            <line x1="15" y1="12" x2="3" y2="12" />
          </svg>
          <span>Please login to start building your resume</span>
        </div>
      )}

    </section>
  );
}