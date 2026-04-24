import { useState, useEffect, useRef, useCallback } from "react";
import "../styles/TemplateSlider.css"; // Custom animations & effects

import temp1 from "../assets/res1.png";
import temp2 from "../assets/res2.webp";
import temp3 from "../assets/res3.jpg";
import temp4 from "../assets/res4.png";

const templates = [
  {
    title: "Modern Resume Template",
    subtitle: "Clean layout with bold typography and structured sections",
    bg: "purple",
    image: temp1,
    tag: "TRENDING",
  },
  {
    title: "Creative Resume Design",
    subtitle: "Stand out with unique visual storytelling and color palettes",
    bg: "red",
    image: temp2,
    tag: "POPULAR",
  },
  {
    title: "Professional Layout",
    subtitle: "Corporate-ready polished format that commands respect",
    bg: "green",
    image: temp3,
    tag: "NEW",
  },
  {
    title: "ATS Friendly Resume",
    subtitle: "Optimized formatting to pass applicant tracking systems",
    bg: "blue",
    image: temp4,
    tag: "RECOMMENDED",
  },
];

export default function TemplateSlider() {
  const [index, setIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const animLock = useRef(false);
  const imageRef = useRef(null);

  // Premium 3D Tilt Effect Logic
  const handleMouseMove = (e) => {
    if (!imageRef.current) return;
    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8; // Adjust 8 for tilt intensity
    const rotateY = ((x - centerX) / centerX) * 8;
    
    imageRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
  };

  const handleMouseLeave = () => {
    if (!imageRef.current) return;
    imageRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  };

  const goToSlide = useCallback((newIndex) => {
    if (animLock.current) return;
    animLock.current = true;
    setIndex(newIndex);
    setTimeout(() => { animLock.current = false; }, 900);
  }, []);

  const nextSlide = useCallback(() => {
    setIndex((prev) => (prev + 1) % templates.length);
  }, []);

  const prevSlide = useCallback(() => {
    setIndex((prev) => (prev - 1 + templates.length) % templates.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(nextSlide, 5500);
    return () => clearInterval(timer);
  }, [index, isPaused, nextSlide]);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [nextSlide, prevSlide]);

  return (
    <section
      className={`relative w-full overflow-hidden mt-24 rounded-3xl bg-[#08080d] outline-none ${isPaused ? "is-paused" : ""}`}
      tabIndex={0}
    >
      {/* Ambient Background Orbs */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center gap-4 p-6 md:p-8">
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-mono text-lg font-bold text-white/90">{String(index + 1).padStart(2, "0")}</span>
          <span className="block w-px h-3.5 bg-white/20" />
          <span className="font-mono text-sm text-white/40">{String(templates.length).padStart(2, "0")}</span>
        </div>

        <div className="flex-1 h-0.5 bg-white/10 rounded-full overflow-hidden">
          <div className="progress-fill h-full w-0 rounded-full" key={`prog-${index}`} />
        </div>

        <span className="shrink-0 px-3.5 py-1.5 bg-white/[0.07] border border-white/10 rounded-full text-[10px] font-bold tracking-[0.2em] text-white/60 backdrop-blur-md uppercase">
          {templates[index].tag}
        </span>
      </div>

      {/* Arrows */}
      <button className="arrow-btn left-6 md:left-8" onClick={prevSlide} aria-label="Previous slide">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
      </button>
      <button className="arrow-btn right-6 md:right-8" onClick={nextSlide} aria-label="Next slide">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
      </button>

      {/* Viewport */}
      <div
        className="relative z-10 overflow-hidden"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="slider-track flex will-change-transform"
          style={{ transform: `translateX(-${index * 100}%)` }}
        >
          {templates.map((item, i) => (
            <div key={i} className={`template-slide slide-${item.bg} min-w-full px-6 py-24 md:px-20 md:py-28 ${i === index ? "active" : ""}`}>
              
              {/* Noise & Floating Shapes */}
              <div className="slide-noise absolute inset-0 pointer-events-none z-[1]" aria-hidden="true" />
              <div className="absolute inset-0 pointer-events-none z-[1]" aria-hidden="true">
                <div className="fshape ring" />
                <div className="fshape ring-sm" />
                <div className="fshape dots-grid" />
                <div className="fshape plus" />
                <div className="fshape semi-circle" />
              </div>

              {/* Inner Content */}
              <div className="slide-inner relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-16 max-w-7xl mx-auto">
                
                {/* Text Side */}
                <div className="flex-1 max-w-xl flex flex-col items-center md:items-start text-center md:text-left">
                  <span className="inline-block px-5 py-1.5 bg-white/[0.08] border border-white/15 rounded-full text-[11px] font-bold tracking-[0.25em] text-white/80 backdrop-blur-sm mb-7 uppercase">
                    {item.tag}
                  </span>

                  <div className="w-11 h-[3px] bg-white/60 rounded-full mb-6" />

                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-white mb-5 drop-shadow-2xl">
                    {item.title}
                  </h2>

                  <p className="text-lg text-white/70 leading-relaxed mb-3">
                    {item.subtitle}
                  </p>

                  <p className="text-sm text-white/40 leading-relaxed mb-10 max-w-md">
                    Attractive crafted resume templates designed to impress recruiters and help you land your dream job faster.
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-12">
                    <button className="group flex items-center gap-2.5 px-9 py-4 bg-white text-[#08080d] rounded-full font-bold text-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]">
                      <span>Use Template</span>
                      <svg className="transition-transform duration-300 group-hover:translate-x-1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                    </button>
                    <button className="px-9 py-4 bg-white/[0.06] text-white/80 border border-white/15 rounded-full font-semibold text-sm backdrop-blur-md transition-all duration-300 hover:bg-white/[0.14] hover:border-white/30 hover:text-white">
                      Preview All
                    </button>
                  </div>

                  {/* Mini Stats */}
                  <div className="flex items-center justify-center md:justify-start gap-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-xl font-extrabold text-white tracking-tight">1</span>
                      <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider">Template</span>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="flex flex-col gap-1">
                      <span className="text-xl font-extrabold text-white tracking-tight">4</span>
                      <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider">Core Features</span>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="flex flex-col gap-1">
                      <span className="text-xl font-extrabold text-white tracking-tight">50k+</span>
                      <span className="text-[11px] font-medium text-white/30 uppercase tracking-wider">Downloads</span>
                    </div>
                  </div>
                </div>

                {/* Image Side with 3D Tilt */}
                <div className="flex-1 flex justify-center items-center perspective-[1200px]">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] img-glow pointer-events-none" />
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-4/5 h-8 bg-black/40 blur-[25px] rounded-full pointer-events-none" />
                  
                  <div 
                    ref={imageRef}
                    className="relative z-10 rounded-2xl overflow-hidden transition-transform duration-200 ease-out cursor-pointer img-shadow-custom"
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    <img src={item.image} alt={item.title} loading="lazy" className="block w-full max-w-[420px] h-auto" />
                    <div className="img-shine absolute inset-0 pointer-events-none" />
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pill Nav */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2 p-2.5 bg-black/30 border border-white/[0.08] rounded-full backdrop-blur-2xl shadow-2xl">
        {templates.map((_, i) => (
          <button
            key={i}
            className={`relative w-9 h-1.5 rounded-full border-none cursor-pointer p-0 overflow-hidden transition-all duration-500 ease-out ${i === index ? "w-14 bg-white/10" : "bg-white/15 hover:bg-white/25"}`}
            onClick={() => goToSlide(i)}
            aria-label={`Go to slide ${i + 1}`}
          >
            <span className={`block h-full rounded-full transition-all duration-500 ease-out ${i === index ? "w-full bg-white/90" : "w-0"}`} />
          </button>
        ))}
      </div>
    </section>
  );
}