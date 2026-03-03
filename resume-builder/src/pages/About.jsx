import {
  FaBolt,
  FaFileAlt,
  FaDownload,
  FaUserCheck
} from "react-icons/fa";
import aboutImage from "../assets/illustration.png";
import TemplateSlider from "../components/TemplateSlider";
import "../styles/About.css";

const About = () => {
  return (
    <>
    <section className="about-section">

      {/* ===== TOP CONTENT ===== */}
      <div className="about-container">

        {/* LEFT CONTENT */}
        <div className="about-text reveal">

          <h5>About Website</h5>

          <h2>Our Resume Builder Journey</h2>

          <p>
            Our Instant Resume Builder is designed to simplify resume
            creation for students, job seekers, and professionals.
            With modern templates and intelligent customization,
            users can quickly generate ATS-friendly resumes.
          </p>

          <p>
            The platform focuses on speed, simplicity, and professional
            design standards to help users present their skills effectively
            and increase hiring opportunities across industries.
          </p>

          <p>
            From beginners creating their first resume to experienced
            professionals upgrading careers, our system provides an
            effortless resume-building experience.
          </p>

        </div>

        {/* RIGHT IMAGE */}
        <div className="about-image reveal">
          <img src={aboutImage} alt="Resume Builder" />
        </div>

      </div>


      {/* ===== FLIP CARDS ===== */}
      <div className="about-cards">

        <div className="flip-card">
  <div className="flip-inner">

    <div className="flip-front">
  <FaBolt className="card-icon"/>
  <h3>Easy Resume Creation</h3>
</div>

<div className="flip-back">
  <p>Build resumes quickly with guided steps, making resume creation simple, fast, and professionally structured.
</p>
</div>

  </div>
</div>

        <div className="flip-card">
  <div className="flip-inner">

    <div className="flip-front">
  <FaFileAlt className="card-icon"/>
  <h3>Modern Templates</h3>
</div>

<div className="flip-back">
  <p>ATS-optimized professional layouts designed to enhance readability and present your resume in a clean structured format.
</p>
</div>

  </div>
</div>

        <div className="flip-card">
  <div className="flip-inner">

    <div className="flip-front">
  <FaDownload className="card-icon"/>
  <h3>Fast Download</h3>
</div>

<div className="flip-back">
  <p>Export resumes instantly as PDF format for quick downloading and maintaining a clean professional appearance across platforms.
</p>
</div>

  </div>
</div>
        <div className="flip-card">
  <div className="flip-inner">

    <div className="flip-front">
  <FaUserCheck className="card-icon"/>
  <h3>User Friendly</h3>
</div>

<div className="flip-back">
  <p>Simple experience for all users with an intuitive interface that makes resume building easy, smooth, and accessible for everyone.
</p>
</div>

  </div>
</div>

      </div>

    </section>
     <TemplateSlider />
     </>
  );
};

export default About;