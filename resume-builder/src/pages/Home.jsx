import { useEffect, useRef } from "react";
import bgImage from "../assets/home-bg.png";
import "../styles/Home.css";

import About from "./About";

export default function Home() {

  const heroRef = useRef(null);

  useEffect(() => {

    const handleScroll = () => {
      if (!heroRef.current) return;

      const scrollY = window.scrollY;

      heroRef.current.style.transform =
        `translateY(${scrollY * 0.15}px)`;
    };

    window.addEventListener("scroll", handleScroll);

    return () =>
      window.removeEventListener("scroll", handleScroll);

  }, []);

  /* ===== Scroll Reveal Effect ===== */
useEffect(() => {

  const reveals = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    },
    {
      threshold: 0.15,
    }
  );

  reveals.forEach(el => observer.observe(el));

  return () => observer.disconnect();

}, []);

  return (
    <>
      {/* HERO */}
      <section
        ref={heroRef}
        id="home"
        className="home-hero"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="hero-wrapper">
          <div className="hero-text reveal">

            <h1>
              Create your winning{" "}
              <span className="highlight">
                resume
                <span className="underline"></span>
              </span>
              <br /> in minutes
            </h1>

            <p>
              Build professional, recruiter-approved resumes in just a few clicks.
              Customize your resume for any job.
            </p>

            <button className="hero-btn">
              Create Your CV Now
            </button>

          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="reveal">
        <About />
      </section>
    </>
  );
}