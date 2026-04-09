import { useState } from "react";
import "../styles/EditResume.css";

export default function EditResume() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [resumeData, setResumeData] = useState(null);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload and extract structured data
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a PDF file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/api/upload-resume/",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      setResumeData({
  ...data.data,
  hobbies: data.data.hobbies || [],
  languages: data.data.languages || [],
});

    } catch (error) {
      console.error(error);
      alert("Error uploading file");
    } finally {
      setLoading(false);
    }
  };

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

    if (!response.ok) {
      throw new Error("PDF generation failed");
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "resume.pdf";
    a.click();

  } catch (error) {
    console.error(error);
    alert("Error generating PDF");
  }
};

  return (
    <section className="edit-page">
      <h1>Edit Your Resume</h1>

      {/* Upload Section */}
      <div className="upload-box">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />

        <button onClick={handleUpload} disabled={loading}>
          {loading ? "Processing..." : "Upload & Extract"}
        </button>
      </div>

      {/* Editable Form */}
      {resumeData && (
        <div className="editor-box">

          <div className="preview-box">
  <h3>Live Preview</h3>

  <div className="resume-preview">

    {/* HEADER */}
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
        <p>{(resumeData.summary || []).join(" ")}</p>

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

          <h3>Edit Resume</h3>

          {/* Name */}
          <input
            type="text"
            value={resumeData.name || ""}
            onChange={(e) =>
              setResumeData({ ...resumeData, name: e.target.value })
            }
            placeholder="Full Name"
          />

          {/* Email */}
          <input
            type="text"
            value={resumeData.email || ""}
            onChange={(e) =>
              setResumeData({ ...resumeData, email: e.target.value })
            }
            placeholder="Email"
          />

          {/* Phone */}
          <input
            type="text"
            value={resumeData.phone || ""}
            onChange={(e) =>
              setResumeData({ ...resumeData, phone: e.target.value })
            }
            placeholder="Phone"
          />

          {/* Summary */}
<h4>Career Objective</h4>
<textarea
  value={(resumeData.summary || []).join(" ")}
  onChange={(e) =>
    setResumeData({
      ...resumeData,
      summary: [e.target.value],
    })
  }
  placeholder="Enter your career objective"
/>

          {/* Skills */}
          <h4>Skills</h4>
          <textarea
            value={(resumeData.skills || []).join("\n")}
            onChange={(e) =>
              setResumeData({
                ...resumeData,
                skills: e.target.value.split("\n"),
              })
            }
          />

          {/* Projects */}
          <h4>Projects</h4>
          <textarea
            value={(resumeData.projects || []).join("\n")}
            onChange={(e) =>
              setResumeData({
                ...resumeData,
                projects: e.target.value.split("\n"),
              })
            }
          />

          {/* Experience */}
          <h4>Experience</h4>
          <textarea
            value={(resumeData.experience || []).join("\n")}
            onChange={(e) =>
              setResumeData({
                ...resumeData,
                experience: e.target.value.split("\n"),
              })
            }
          />

          {/* Education */}
          <h4>Education</h4>
          <textarea
            value={(resumeData.education || []).join("\n")}
            onChange={(e) =>
              setResumeData({
                ...resumeData,
                education: e.target.value.split("\n"),
              })
            }
          />

          {/* LANGUAGES */}
<h4>Languages</h4>
{(resumeData.languages || []).map((lang, index) => (
  <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "5px" }}>
    <input
      type="text"
      value={lang}
      onChange={(e) => {
        const updated = [...resumeData.languages];
        updated[index] = e.target.value;
        setResumeData({ ...resumeData, languages: updated });
      }}
    />
    <button onClick={() => {
      const updated = resumeData.languages.filter((_, i) => i !== index);
      setResumeData({ ...resumeData, languages: updated });
    }}>
      ❌
    </button>
  </div>
))}

<button onClick={() =>
  setResumeData({
    ...resumeData,
    languages: [...(resumeData.languages || []), ""],
  })
}>
  ➕ Add Language
</button>


{/* HOBBIES */}
<h4>Hobbies</h4>
{(resumeData.hobbies || []).map((hob, index) => (
  <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "5px" }}>
    <input
      type="text"
      value={hob}
      onChange={(e) => {
        const updated = [...resumeData.hobbies];
        updated[index] = e.target.value;
        setResumeData({ ...resumeData, hobbies: updated });
      }}
    />
    <button onClick={() => {
      const updated = resumeData.hobbies.filter((_, i) => i !== index);
      setResumeData({ ...resumeData, hobbies: updated });
    }}>
      ❌
    </button>
  </div>
))}

<button onClick={() =>
  setResumeData({
    ...resumeData,
    hobbies: [...(resumeData.hobbies || []), ""],
  })
}>
  ➕ Add Hobby
</button>

          <button onClick={handleGenerate}>
            Generate Resume
          </button>

        </div>
      )}
    </section>
  );
}