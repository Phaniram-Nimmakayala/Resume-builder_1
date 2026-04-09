import { useNavigate } from "react-router-dom";
import "../styles/ResumeOptions.css";

export default function ResumeOptions() {

  const navigate = useNavigate();

  return (
    <section className="options-page">

      <h1 className="options-title">
        Choose Your Resume Method
      </h1>

      <div className="options-container">

        {/* EDIT RESUME CARD */}
        <div className="option-card">

          <h2>Edit Existing Resume</h2>

          <p>
            Upload your existing resume and edit it easily
            using our smart editor.
          </p>

          <button
            onClick={() => navigate("/edit-resume")}
            className="option-btn"
          >
            Edit Resume
          </button>

        </div>

        {/* FUTURE CARD */}
        <div className="option-card disabled">

          <h2>Create From Scratch</h2>

          <p>
            Build a new resume step-by-step with our
            guided form builder.
          </p>

          <button
  onClick={() => navigate("/create-resume")}
  className="option-btn"
>
  Build Resume
</button>

        </div>

        <div className="option-card">

  <h2>Find Jobs</h2>

  <p>
    Upload your resume and get job recommendations
    based on your skills and experience.
  </p>

  <button
    onClick={() => navigate("/find-jobs")}
    className="option-btn"
  >
    Find Jobs
  </button>

</div>

<div className="option-card">

  <h2>AI Interview Bot</h2>

  <p>
    Practice interview questions based on your resume and get a performance score.
  </p>

  <button
    onClick={() => navigate("/ai-interview")}
    className="option-btn"
  >
    Start Interview
  </button>

</div>

      </div>

    </section>
  );
}