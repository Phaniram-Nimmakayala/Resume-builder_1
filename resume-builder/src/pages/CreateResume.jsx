import { useState } from "react";
import "../styles/CreateResume.css";

export default function CreateResume() {

  const [resumeData, setResumeData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    linkedin: "",
    github: "",
    portfolio: "",
    summary: [""],
    skills: [],
    projects: [],
    education: [],
    experience: [],
    certifications: [],
    hobbies: [],
    languages: []
  });

  const handleGenerate = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/generate-resume/",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: resumeData }),
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();

    } catch {
      alert("Error generating resume");
    }
  };

  const updateField = (field, value) => {
    setResumeData((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field, value) => {
    setResumeData((prev) => ({ ...prev, [field]: value.split("\n") }));
  };

  return (
    <div className="cr-container">

      {/* ── LEFT FORM PANEL ── */}
      <div className="cr-form-panel">
        
        <div className="cr-header">
          <div className="cr-header-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          </div>
          <div>
            <h2>Create Resume</h2>
            <p>Fill in the details to generate your professional resume</p>
          </div>
        </div>

        {/* ── Card 1: Personal Info ── */}
        <div className="cr-card">
          <h3 className="cr-card-title">Personal Information</h3>
          
          <div className="cr-grid">
            <div className="cr-field">
              <label>Full Name</label>
              <div className="cr-input-wrap">
                <svg className="cr-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <input placeholder="John Doe" onChange={(e) => updateField("name", e.target.value)} />
              </div>
            </div>

            <div className="cr-field">
              <label>Email Address</label>
              <div className="cr-input-wrap">
                <svg className="cr-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
                <input placeholder="john@example.com" onChange={(e) => updateField("email", e.target.value)} />
              </div>
            </div>

            <div className="cr-field">
              <label>Address</label>
              <div className="cr-input-wrap">
                <svg className="cr-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <input placeholder="123 Main St, City" onChange={(e) => updateField("address", e.target.value)} />
              </div>
            </div>

            <div className="cr-field">
              <label>Phone Number</label>
              <div className="cr-input-wrap">
                <svg className="cr-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
                <input placeholder="+1 234 567 890" onChange={(e) => updateField("phone", e.target.value)} />
              </div>
            </div>

            <div className="cr-field">
              <label>LinkedIn Link</label>
              <div className="cr-input-wrap">
                <svg className="cr-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                <input placeholder="linkedin.com/in/johndoe" onChange={(e) => updateField("linkedin", e.target.value)} />
              </div>
            </div>

            <div className="cr-field">
              <label>GitHub Link</label>
              <div className="cr-input-wrap">
                <svg className="cr-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                <input placeholder="github.com/johndoe" onChange={(e) => updateField("github", e.target.value)} />
              </div>
            </div>

            <div className="cr-field cr-span-2">
              <label>Portfolio Website</label>
              <div className="cr-input-wrap">
                <svg className="cr-svg-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg>
                <input placeholder="www.johndoe.com" onChange={(e) => updateField("portfolio", e.target.value)} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Card 2: Objective ── */}
        <div className="cr-card">
          <h3 className="cr-card-title">Career Objective</h3>
          <div className="cr-field">
            <textarea rows={4} placeholder="A brief summary of your career goals and key strengths..." onChange={(e) => updateArrayField("summary", e.target.value)} />
          </div>
        </div>

        {/* ── Card 3: Education & Experience ── */}
        <div className="cr-card">
          <h3 className="cr-card-title">Education & Experience</h3>
          <div className="cr-grid">
            <div className="cr-field">
              <label>Education (One per line)</label>
              <textarea rows={4} placeholder="B.Tech in Computer Science - XYZ University (2020-2024)&#10;12th Standard - ABC School (2018-2020)" onChange={(e) => updateArrayField("education", e.target.value)} />
            </div>
            <div className="cr-field">
              <label>Experience (One per line)</label>
              <textarea rows={4} placeholder="Software Engineer at Corp - 1 year&#10;Intern at Startup - 6 months" onChange={(e) => updateArrayField("experience", e.target.value)} />
            </div>
          </div>
        </div>

        {/* ── Card 4: Skills & Projects ── */}
        <div className="cr-card">
          <h3 className="cr-card-title">Skills & Projects</h3>
          <div className="cr-grid">
            <div className="cr-field">
              <label>Skills (One per line)</label>
              <textarea rows={4} placeholder="JavaScript, React, Node.js, Python, SQL" onChange={(e) => updateArrayField("skills", e.target.value)} />
            </div>
            <div className="cr-field">
              <label>Projects (One per line)</label>
              <textarea rows={4} placeholder="E-commerce Website - Built using React and Firebase&#10;Chat App - Built using Node.js and Socket.io" onChange={(e) => updateArrayField("projects", e.target.value)} />
            </div>
          </div>
        </div>

        {/* ── Card 5: Extras ── */}
        <div className="cr-card">
          <h3 className="cr-card-title">Additional Details</h3>
          <div className="cr-grid cr-grid-3">
            <div className="cr-field">
              <label>Certifications</label>
              <textarea rows={3} placeholder="AWS Certified..." onChange={(e) => updateArrayField("certifications", e.target.value)} />
            </div>
            <div className="cr-field">
              <label>Languages</label>
              <textarea rows={3} placeholder="English, Hindi..." onChange={(e) => updateArrayField("languages", e.target.value)} />
            </div>
            <div className="cr-field">
              <label>Hobbies</label>
              <textarea rows={3} placeholder="Reading, Coding..." onChange={(e) => updateArrayField("hobbies", e.target.value)} />
            </div>
          </div>
        </div>

        {/* ── Submit Button ── */}
        <button onClick={handleGenerate} className="cr-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Download Resume
        </button>

      </div>

      {/* ── RIGHT PREVIEW PANEL ── */}
      <div className="cr-preview-panel">

        <div className="cr-paper">

          <div className="cr-paper-head">
            {resumeData.name || "Your Name"}
          </div>

          <div className="cr-paper-body">

            <div className="cr-paper-left">

              <h4>CONTACT DETAILS</h4>
              <p>{resumeData.phone}</p>
              <p>{resumeData.email}</p>
              <p>{resumeData.linkedin}</p>
              <p>{resumeData.github}</p>
              <p>{resumeData.portfolio}</p>

              <h4>SKILLS</h4>
              {(resumeData.skills || []).map((s, i) => <p key={i}>{s}</p>)}

              <h4>LANGUAGES</h4>
              {(resumeData.languages || []).map((l, i) => <p key={i}>{l}</p>)}

              <h4>HOBBIES</h4>
              {(resumeData.hobbies || []).map((h, i) => <p key={i}>{h}</p>)}

            </div>

            <div className="cr-paper-right">

              <h4>CAREER OBJECTIVE</h4>
              <p>{resumeData.summary.join(" ")}</p>

              <h4>EDUCATION</h4>
              {(resumeData.education || []).map((e, i) => <p key={i}>{e}</p>)}

              <h4>EXPERIENCE</h4>
              {(resumeData.experience || []).map((e, i) => <p key={i}>{e}</p>)}

              <h4>PROJECTS</h4>
              {(resumeData.projects || []).map((p, i) => <p key={i}>{p}</p>)}

              <h4>CERTIFICATIONS</h4>
              {(resumeData.certifications || []).map((c, i) => <p key={i}>{c}</p>)}

            </div>

          </div>
        </div>
      </div>

    </div>
  );
}