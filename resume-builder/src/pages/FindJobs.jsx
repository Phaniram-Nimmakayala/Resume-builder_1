import { useState } from "react";
import "../styles/FindJobs.css";

export default function FindJobs() {

  const [file, setFile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      alert("Please upload resume");
      return;
    }

    setLoading(true);
    console.log("Uploading file...");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/upload-resume/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("Resume Data:", data);

      if (!data.data) {
        alert("Resume parsing failed");
        setLoading(false);
        return;
      }

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
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const getFileSize = (size) => {
    if (size < 1024) return size + " B";
    if (size < 1048576) return (size / 1024).toFixed(1) + " KB";
    return (size / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="fj-page">

      {/* Ambient Background */}
      <div className="fj-bg-orb fj-bg-orb-1"></div>
      <div className="fj-bg-orb fj-bg-orb-2"></div>
      <div className="fj-bg-orb fj-bg-orb-3"></div>

      {/* Header */}
      <header className="fj-header">
        <div className="fj-header-content">
          <span className="fj-badge">AI-Powered</span>
          <h1 className="fj-title">Find Your Dream Job</h1>
          <p className="fj-subtitle">
            Upload your resume and let our intelligent matching engine discover the best opportunities tailored to your skills
          </p>
        </div>
      </header>

      {/* Upload Section */}
      <section className="fj-upload-section">

        <div
          className={`fj-upload-zone ${dragOver ? "fj-upload-zone--active" : ""} ${file ? "fj-upload-zone--filled" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            id="resume-input"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="fj-file-input"
          />

          {!file ? (
            <label htmlFor="resume-input" className="fj-upload-label">
              <div className="fj-upload-icon-wrap">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
              </div>
              <span className="fj-upload-main-text">
                Drop your resume here or <strong>browse</strong>
              </span>
              <span className="fj-upload-sub-text">
                Supports PDF, DOC, DOCX — Max 5MB
              </span>
            </label>
          ) : (
            <div className="fj-file-selected">
              <div className="fj-file-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
              </div>
              <div className="fj-file-info">
                <span className="fj-file-name">{file.name}</span>
                <span className="fj-file-size">{getFileSize(file.size)}</span>
              </div>
              <label htmlFor="resume-input" className="fj-file-change">
                Change
              </label>
            </div>
          )}
        </div>

        <button
          className={`fj-submit-btn ${loading ? "fj-submit-btn--loading" : ""}`}
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? (
            <span className="fj-btn-loading">
              <span className="fj-spinner"></span>
              Analyzing Resume & Finding Jobs...
            </span>
          ) : (
            <span className="fj-btn-ready">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              Upload & Find Jobs
            </span>
          )}
        </button>

      </section>

      {/* Results Section */}
      <section className="fj-results-section">

        {jobs.length > 0 && (
          <div className="fj-results-header">
            <h2 className="fj-results-title">
              <span className="fj-results-count">{jobs.length}</span> Jobs Found
            </h2>
            <p className="fj-results-sub">Based on your resume skills analysis</p>
          </div>
        )}

        <div className="fj-jobs-grid">
          {jobs.map((job, i) => (
            <div key={i} className="fj-job-card" style={{ animationDelay: `${i * 0.06}s` }}>

              <div className="fj-job-card-top">
                <div className="fj-job-icon-wrap">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </div>
                <span className="fj-job-index">#{i + 1}</span>
              </div>

              <h3 className="fj-job-title">{job.title}</h3>

              <div className="fj-job-meta">
                <span className="fj-job-company">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  {job.company}
                </span>
                <span className="fj-job-location">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  {job.location}
                </span>
              </div>

              <a
                href={job.url}
                target="_blank"
                rel="noreferrer"
                className="fj-apply-btn"
              >
                <span>Apply Now</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </a>

            </div>
          ))}
        </div>

        {/* Empty State */}
        {jobs.length === 0 && !loading && (
          <div className="fj-empty-state">
            <div className="fj-empty-icon">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <h3>No jobs fetched yet</h3>
            <p>Upload your resume above to discover matched opportunities</p>
          </div>
        )}

      </section>

    </div>
  );
}