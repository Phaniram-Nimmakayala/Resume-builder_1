import { useEffect, useState } from "react";
import "../styles/About.css";
import aboutImage from "../assets/illustration.png";

const About = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimate(true), 200);
  }, []);

  return (
    <section id="about" className="about-section">

      {/* ===== Feature Blocks ===== */}
      <div className="features-grid">
        {[
          {
            letter: "A",
            title: "ATS Friendly Templates",
            text: "Our resumes are designed to pass Applicant Tracking Systems and increase your chances of getting shortlisted."
          },
          {
            letter: "B",
            title: "Modern Designs",
            text: "Choose from professionally crafted templates built with modern hiring trends in mind."
          },
          {
            letter: "C",
            title: "Powerful Customization",
            text: "Edit sections, reorder content, and personalize your resume according to your career goals."
          },
          {
            letter: "D",
            title: "Instant Download",
            text: "Download your resume instantly in PDF format and start applying for jobs immediately."
          }
        ].map((item, index) => (
          <div key={index} className="feature-card">
            <div className="feature-icon">{item.letter}</div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>

      {/* ===== Welcome Section ===== */}
      <div className="welcome-section">

        <div className={`welcome-left ${animate ? "slide-left" : ""}`}>
          <img src={aboutImage} alt="Resume Builder Illustration" />
        </div>

        <div className={`welcome-right ${animate ? "slide-right" : ""}`}>
          <h2>Welcome to Instant Resume Builder</h2>
          <p>
            Instant Resume Builder helps students and professionals create 
            high-quality resumes in minutes. Our platform simplifies resume 
            creation while maintaining professional standards required by 
            recruiters.
          </p>
          <p>
            Whether you're a fresher or experienced candidate, our tools 
            guide you step-by-step to build resumes that stand out and 
            increase your hiring chances.
          </p>
        </div>

      </div>

      {/* ===== Testimonials ===== */}
      <div className="testimonial-section">
        <h2>Testimonials</h2>
        <div className="testimonial-card">
          <p>
            “This resume builder helped me create a professional resume 
            in just 15 minutes. I got interview calls within a week!”
          </p>
          <h4>— Satisfied User</h4>
        </div>
      </div>

    </section>
  );
};

export default About;
