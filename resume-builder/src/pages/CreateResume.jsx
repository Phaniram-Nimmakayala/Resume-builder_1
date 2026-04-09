import { useState } from "react";
import "../styles/EditResume.css";

export default function CreateResume() {

  const [resumeData, setResumeData] = useState({
    name: "",
    email: "",
    phone: "",
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
    languages: [],
    strengths: []
  });

  // ✅ GENERATE PDF
  const handleGenerate = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/generate-resume/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: resumeData }),
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "resume.pdf";
      a.click();

    } catch (error) {
      alert("Error generating resume");
    }
  };

  return (
    <section className="edit-page">

      <h1>Create Resume</h1>

      <div className="editor-box">

        {/* RIGHT SIDE PREVIEW */}
        <div className="preview-box">
          <h3>Live Preview</h3>

          <div className="resume-preview">

            <div className="preview-header">
              {resumeData.name}
            </div>

            <div className="preview-body">

              {/* LEFT */}
              <div className="preview-left">

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

              {/* RIGHT */}
              <div className="preview-right">

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

        {/* LEFT SIDE FORM */}
        <h3>Fill Your Details</h3>

        <input placeholder="Full Name"
          onChange={(e) => setResumeData({...resumeData, name: e.target.value})}
        />

        <input placeholder="Email"
          onChange={(e) => setResumeData({...resumeData, email: e.target.value})}
        />

        <input placeholder="Phone"
          onChange={(e) => setResumeData({...resumeData, phone: e.target.value})}
        />

        <textarea placeholder="Career Objective"
          onChange={(e) => setResumeData({...resumeData, summary: [e.target.value]})}
        />

        {/* MULTI FIELDS */}

        <h4>Skills</h4>
        <textarea onChange={(e) =>
          setResumeData({...resumeData, skills: e.target.value.split("\n")})
        } />

        <h4>Education</h4>
        <textarea onChange={(e) =>
          setResumeData({...resumeData, education: e.target.value.split("\n")})
        } />

        <h4>Experience</h4>
        <textarea onChange={(e) =>
          setResumeData({...resumeData, experience: e.target.value.split("\n")})
        } />

        <h4>Projects</h4>
        <textarea onChange={(e) =>
          setResumeData({...resumeData, projects: e.target.value.split("\n")})
        } />

        <h4>Certifications</h4>
        <textarea onChange={(e) =>
          setResumeData({...resumeData, certifications: e.target.value.split("\n")})
        } />

        <h4>Languages</h4>
        <textarea onChange={(e) =>
          setResumeData({...resumeData, languages: e.target.value.split("\n")})
        } />

        <h4>Hobbies</h4>
        <textarea onChange={(e) =>
          setResumeData({...resumeData, hobbies: e.target.value.split("\n")})
        } />

        <button onClick={handleGenerate}>
          Generate Resume
        </button>

      </div>

    </section>
  );
}