import { useEffect, useRef, useState } from "react";
import bgImage from "../assets/home-bg.png";
import "../styles/Home.css";

import About from "./About";
import BuildResume from "./BuildResume";
import Contact from "./Contact";

export default function Home() {
  const heroRef = useRef(null);
  const [loaded, setLoaded] = useState(false);

  /* Parallax scroll */
  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return;
      const scrollY = window.scrollY;
      heroRef.current.style.transform = `translateY(${scrollY * 0.25}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* Scroll reveal */
  useEffect(() => {
    setLoaded(true);
    const reveals = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
          }
        });
      },
      { threshold: 0.1 }
    );
    reveals.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* Scroll to Build Resume section */
  const goToBuildResume = () => {
    const section = document.getElementById("build-resume");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      {/* ═══════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════ */}
      <section
        ref={heroRef}
        id="home"
        className={`home-hero ${loaded ? "is-loaded" : ""}`}
      >
        {/* Background image layer */}
        <div
          className="hero-bg-img"
          style={{ backgroundImage: `url(${bgImage})` }}
        />

        {/* Gradient overlay */}
        <div className="hero-gradient-overlay" />

        {/* Noise texture */}
        <div className="hero-noise" aria-hidden="true" />

        {/* Floating decorative elements */}
        <div className="hero-decor" aria-hidden="true">
          <div className="decor-ring dr-1" />
          <div className="decor-ring dr-2" />
          <div className="decor-ring dr-3" />
          <div className="decor-dot-grid ddg-1" />
          <div className="decor-cross dc-1" />
          <div className="decor-cross dc-2" />
          <div className="decor-blur db-1" />
          <div className="decor-blur db-2" />
          <div className="decor-line dl-1" />
          <div className="decor-line dl-2" />
        </div>

        {/* Main content */}
        <div className="hero-content">
          <div className="hero-inner">

            {/* Text column */}
            <div className="hero-text-col">
              {/* Eyebrow */}
              <div className="hero-eyebrow anim-item" data-delay="0">
                <span className="eyebrow-pulse" />
                <span>#Resume Builder Platform</span>
              </div>

              {/* Heading */}
              <h1 className="hero-heading anim-item" data-delay="1">
                Create your
                <br />
                <span className="heading-accent">
                  winning resume
                  <svg
                    className="accent-squiggle"
                    viewBox="0 0 260 14"
                    fill="none"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M3 10 C50 3, 90 3, 130 7 S210 13, 257 5"
                      stroke="url(#squigGrad)"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <defs>
                      <linearGradient
                        id="squigGrad"
                        x1="0"
                        y1="0"
                        x2="260"
                        y2="0"
                      >
                        <stop offset="0%" stopColor="#a78bfa" />
                        <stop offset="100%" stopColor="#7c3aed" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                <br />
                <span className="heading-rest">in minutes</span>
              </h1>

              {/* Subtext */}
              <p className="hero-sub anim-item" data-delay="2">
                Build professional, recruiter-approved resumes in just a few
                clicks. Customize your resume for any job and land interviews
                faster.
              </p>

              {/* CTA group */}
              <div className="hero-cta-group anim-item" data-delay="3">
                <button className="cta-primary" onClick={goToBuildResume}>
                  <span>Create Your CV Now</span>
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
                <button className="cta-secondary">
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
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10 8 16 12 10 16 10 8" />
                  </svg>
                  <span>Watch Demo</span>
                </button>
              </div>
            </div>

          </div>

          {/* Scroll indicator */}
          <div className="scroll-indicator anim-item" data-delay="5" aria-hidden="true">
            <div className="scroll-mouse">
              <div className="scroll-dot" />
            </div>
            <span className="scroll-text">Scroll to explore</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════
          SECTIONS
      ═══════════════════════════════════ */}
      <section id="about" className="reveal">
        <About />
      </section>

      <section id="build-resume" className="reveal">
        <BuildResume />
      </section>

      <section id="contact" className="reveal">
        <Contact />
      </section>

      
    </>
  );
}