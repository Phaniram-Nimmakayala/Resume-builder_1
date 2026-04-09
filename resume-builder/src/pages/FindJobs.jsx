import { useState } from "react";
import "../styles/FindJobs.css";

export default function FindJobs() {

  const [file, setFile] = useState(null);
  const [jobs, setJobs] = useState([]);

  const handleUpload = async () => {
  if (!file) {
    alert("Please upload resume");
    return;
  }

  console.log("Uploading file...");

  const formData = new FormData();
  formData.append("file", file);

  try {
    // 🔥 STEP 1: Extract Resume
    const res = await fetch("http://127.0.0.1:8000/api/upload-resume/", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    console.log("Resume Data:", data);

    if (!data.data) {
      alert("Resume parsing failed");
      return;
    }

    // 🔥 STEP 2: Fetch Jobs
    const jobRes = await fetch("http://127.0.0.1:8000/api/find-jobs/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        skills: data.data.skills,
      }),
    });

    const jobData = await jobRes.json();
    console.log("Jobs:", jobData);

    setJobs(jobData.jobs || []);

  } catch (err) {
    console.error(err);
    alert("Error occurred");
  }
};

  return (
    <div className="find-jobs-page">

    <h1 className="fj-title">Find Jobs</h1>

    {/* UPLOAD BOX */}
    <div className="upload-card">
      <input 
        type="file" 
        onChange={(e) => setFile(e.target.files[0])} 
      />

      <button onClick={handleUpload}>
        Upload & Find Jobs
      </button>
    </div>

    {/* JOB LIST */}
    <div className="jobs-grid">
      {jobs.map((job, i) => (
        <div key={i} className="job-card">

          <h3>{job.title}</h3>

          <p className="company">{job.company}</p>
          <p className="location">{job.location}</p>

          <a href={job.url} target="_blank" rel="noreferrer">
            Apply Now →
          </a>

        </div>
      ))}
    </div>

  </div>
);
}