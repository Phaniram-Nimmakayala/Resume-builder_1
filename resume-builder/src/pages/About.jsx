import React, { useEffect, useRef } from "react";
import {
  FaBolt,
  FaFileAlt,
  FaDownload,
  FaUserCheck,
} from "react-icons/fa";
import aboutImage from "../assets/illustration.png";
import TemplateSlider from "../components/TemplateSlider";
import "../styles/About.css";

// --- ANIMATION COMPONENT: PREMIUM PARTICLES (UPDATED SIZES) ---
const ParticleCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particlesArray;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      init();
    };
    window.addEventListener("resize", handleResize);

    const mouse = { x: null, y: null, radius: 150 };
    
    const section = canvas.closest('.about-hero');
    const handleMouseMove = (event) => {
        if(section) {
            const rect = section.getBoundingClientRect();
            mouse.x = event.clientX - rect.left;
            mouse.y = event.clientY - rect.top;
        }
    };

    if(section) {
        section.addEventListener('mousemove', handleMouseMove);
        section.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });
    }

    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
        this.density = (Math.random() * 30) + 1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;

        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        // STRONGER MOUSE REPELLSION (Changed += 2 to += 4)
        if (distance < mouse.radius + this.size) {
          if (mouse.x < this.x && this.x < canvas.width - this.size * 10) this.x += 4;
          if (mouse.x > this.x && this.x > this.size * 10) this.x -= 4;
          if (mouse.y < this.y && this.y < canvas.height - this.size * 10) this.y += 4;
          if (mouse.y > this.y && this.y > this.size * 10) this.y -= 4;
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function init() {
      particlesArray = [];
      let numberOfParticles = (canvas.height * canvas.width) / 14000; 
      
      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 4) + 2;
        let x = Math.random() * (canvas.width - size * 2 - size * 2) + size * 2;
        let y = Math.random() * (canvas.height - size * 2 - size * 2) + size * 2;
        
        // FASTER SPEED (Changed 0.6 to 1.5)
        let directionX = (Math.random() * 1.5) - 0.75;
        let directionY = (Math.random() * 1.5) - 0.75;
        
        let color = Math.random() > 0.5 ? "rgba(124, 58, 237, 0.5)" : "rgba(59, 130, 246, 0.5)";
        
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    function connect() {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let distance = ((particlesArray[a].x - particlesArray[b].x) * (particlesArray[a].x - particlesArray[b].x)) + 
                         ((particlesArray[a].y - particlesArray[b].y) * (particlesArray[a].y - particlesArray[b].y));
          
          if (distance < (canvas.width / 7) * (canvas.height / 7)) {
            opacityValue = 1 - (distance / 20000);
            ctx.strokeStyle = `rgba(124, 58, 237, ${opacityValue * 0.15})`; 
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connect();
    }

    init();
    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      if(section) {
          section.removeEventListener('mousemove', handleMouseMove);
          section.removeEventListener('mouseleave', () => {
              mouse.x = null;
              mouse.y = null;
          });
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
};

// --- MAIN ABOUT COMPONENT ---
const features = [
  {
    icon: <FaBolt />,
    title: "Easy Resume Creation",
    desc: "Build resumes quickly with guided steps, making resume creation simple, fast, and professionally structured.",
    accent: "#f59e0b",
    bgGrad: "linear-gradient(135deg, #f59e0b, #d97706)",
    shadow: "rgba(245, 158, 11, 0.35)",
  },
  {
    icon: <FaFileAlt />,
    title: "Modern Templates",
    desc: "ATS-optimized professional layouts designed to enhance readability and present your resume in a clean structured format.",
    accent: "#7c3aed",
    bgGrad: "linear-gradient(135deg, #7c3aed, #6d28d9)",
    shadow: "rgba(124, 58, 237, 0.35)",
  },
  {
    icon: <FaDownload />,
    title: "Fast Download",
    desc: "Export resumes instantly as PDF format for quick downloading and maintaining a clean professional appearance across platforms.",
    accent: "#10b981",
    bgGrad: "linear-gradient(135deg, #10b981, #059669)",
    shadow: "rgba(16, 185, 129, 0.35)",
  },
  {
    icon: <FaUserCheck />,
    title: "User Friendly",
    desc: "Simple experience for all users with an intuitive interface that makes resume building easy, smooth, and accessible for everyone.",
    accent: "#3b82f6",
    bgGrad: "linear-gradient(135deg, #3b82f6, #2563eb)",
    shadow: "rgba(59, 130, 246, 0.35)",
  },
];

const About = () => {
  return (
    <main className="about-page">
      {/* ════════════════════════════════════════
          SECTION 1 — HERO ABOUT
      ════════════════════════════════════════ */}
      <section className="about-hero">
        {/* Particle Animation Layer */}
        <ParticleCanvas />

        {/* Decorative blurs */}
        <div className="hero-decor" aria-hidden="true">
          <div className="hblur hb-1" />
          <div className="hblur hb-2" />
          <div className="hblur hb-3" />
          <div className="grid-lines" />
        </div>

        <div className="about-hero-inner">
          {/* Left — Text */}
          <div className="hero-text-col">
            <div className="hero-eyebrow">
              <span className="eyebrow-dot" />
              <span>About The Platform</span>
            </div>

            <h2 className="hero-heading">
              Build Resumes That{" "}
              <span className="heading-highlight">
                Get You Hired
                <svg
                  className="highlight-underline"
                  viewBox="0 0 300 12"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M2 8 C60 2, 120 2, 150 6 S240 12, 298 4"
                    stroke="#7c3aed"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h2>

            <div className="hero-body">
              <p>
                Our Instant Resume Builder simplifies resume creation for
                students, job seekers, and professionals. With modern templates
                and intelligent customization, generate ATS-friendly resumes in
                minutes.
              </p>
              <p>
                From beginners creating their first resume to experienced
                professionals upgrading careers — our system provides an
                effortless, polished experience that increases hiring
                opportunities across every industry.
              </p>
            </div>

            {/* Trust row */}
            <div className="hero-trust">
              <div className="trust-chip">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>ATS Optimized</span>
              </div>
              <div className="trust-chip">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>Build Instantly</span>
              </div>
              <div className="trust-chip">
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#7c3aed"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>100% Accurate</span>
              </div>
            </div>

            
          </div>

          {/* Right — Image */}
          <div className="hero-image-col">
            <div className="image-frame">
              <div className="frame-glow" />
              <div className="frame-border" />
              <img
                src={aboutImage}
                alt="Resume Builder Illustration"
                loading="lazy"
              />
              <div className="frame-shine" />

              {/* Floating badge */}
              <div className="floating-badge fb-1">
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
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
                <span>PDF Ready</span>
              </div>

              <div className="floating-badge fb-2">
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
                  <circle cx="12" cy="8" r="7" />
                  <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
                </svg>
                <span>Pro Design</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 2 — FEATURE FLIP CARDS
      ════════════════════════════════════════ */}
      <section className="features-section">
        <div className="features-header">
          <span className="features-eyebrow">Why Choose Us</span>
          <h3 className="features-title">
            Everything You Need to{" "}
            <span className="ft-accent">Stand Out</span>
          </h3>
          <p className="features-sub">
            Hover over each card to explore the details behind what makes our
            platform different.
          </p>
        </div>

        <div className="features-grid">
          {features.map((f, i) => (
            <div className="flip-card" key={i} style={{ "--accent": f.accent, "--card-shadow": f.shadow }}>
              <div className="flip-inner">
                {/* FRONT */}
                <div
                  className="flip-front"
                  style={{ background: f.bgGrad }}
                >
                  <div className="front-icon-wrap">
                    <span className="front-icon">{f.icon}</span>
                  </div>
                  <h4 className="front-title">{f.title}</h4>
                  <span className="front-hint">Hover to explore →</span>
                </div>

                {/* BACK */}
                <div className="flip-back">
                  <div
                    className="back-accent-bar"
                    style={{ background: f.bgGrad }}
                  />
                  <p className="back-desc">{f.desc}</p>
                  <span
                    className="back-tag"
                    style={{ color: f.accent, borderColor: f.accent + "30" }}
                  >
                    Learn more
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════
          SECTION 3 — TEMPLATE SLIDER
      ════════════════════════════════════════ */}
      <TemplateSlider />
    </main>
  );
};

export default About;