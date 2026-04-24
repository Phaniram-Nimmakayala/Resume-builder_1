import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import "../styles/ResumeOptions.css";

// --- Custom Particle Animation Component ---
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let particlesArray;
    let animationFrameId;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      init();
    };
    window.addEventListener("resize", handleResize);

    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
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
        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function init() {
      particlesArray = [];
      let numberOfParticles = (canvas.height * canvas.width) / 18000;
      for (let i = 0; i < numberOfParticles; i++) {
        let size = Math.random() * 2 + 1;
        let x = Math.random() * (canvas.width - size * 2) + size * 2;
        let y = Math.random() * (canvas.height - size * 2) + size * 2;
        
        let directionX = Math.random() * 1.2 - 0.6;
        let directionY = Math.random() * 1.2 - 0.6;
        
        let color = "rgba(139, 92, 246, 0.8)";
        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) particlesArray[i].update();
      connect();
    }

    function connect() {
      let opacityValue = 1;
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let distance = (particlesArray[a].x - particlesArray[b].x) ** 2 + (particlesArray[a].y - particlesArray[b].y) ** 2;
          if (distance < (canvas.width / 8) * (canvas.height / 8)) {
            opacityValue = 1 - distance / 15000;
            ctx.strokeStyle = `rgba(140, 90, 240, ${opacityValue})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    init();
    animate();
    
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} className="particles-canvas"></canvas>;
};

// --- Icons (SVGs) ---
const Icons = {
  Edit: () => <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>,
  Create: () => <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>,
  Search: () => <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>,
  Bot: () => <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"></rect><circle cx="12" cy="5" r="2"></circle><path d="M12 7v4"></path><line x1="8" y1="16" x2="8" y2="16"></line><line x1="16" y1="16" x2="16" y2="16"></line></svg>
};

export default function ResumeOptions() {
  const navigate = useNavigate();

  return (
    <section className="resume-bg min-h-screen w-full relative text-white overflow-x-hidden flex justify-center items-center font-sans">
      <ParticleBackground />
      
      <div className="relative z-10 w-full max-w-7xl px-5 py-20 text-center">
        
        <h1 className="premium-title text-5xl md:text-6xl lg:text-7xl font-extrabold mb-16 tracking-tight">
          Power Your Career
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 justify-items-center">
          
          {/* CARD 1: EDIT RESUME */}
          <div className="glass-card w-full max-w-xs p-8 flex flex-col items-center cursor-pointer" onClick={() => navigate("/edit-resume")}>
            <div className="icon-box icon-violet mb-6"><Icons.Edit /></div>
            <h2 className="text-xl font-bold mb-3 text-gray-100">Edit Existing Resume</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">Upload your existing resume and edit it easily using our smart editor.</p>
            <button onClick={(e) => { e.stopPropagation(); navigate("/edit-resume"); }} className="premium-btn btn-violet w-full py-3 rounded-xl font-semibold">Edit Resume</button>
          </div>

          {/* CARD 2: CREATE FROM SCRATCH */}
          <div className="glass-card w-full max-w-xs p-8 flex flex-col items-center cursor-pointer" onClick={() => navigate("/create-resume")}>
            <div className="icon-box icon-rose mb-6"><Icons.Create /></div>
            <h2 className="text-xl font-bold mb-3 text-gray-100">Create From Scratch</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">Build a new resume step-by-step with our guided form builder.</p>
            <button onClick={(e) => { e.stopPropagation(); navigate("/create-resume"); }} className="premium-btn btn-rose w-full py-3 rounded-xl font-semibold">Build Resume</button>
          </div>

          {/* CARD 3: FIND JOBS */}
          <div className="glass-card w-full max-w-xs p-8 flex flex-col items-center cursor-pointer" onClick={() => navigate("/find-jobs")}>
            <div className="icon-box icon-blue mb-6"><Icons.Search /></div>
            <h2 className="text-xl font-bold mb-3 text-gray-100">Find Jobs</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">Upload your resume and get job recommendations based on your skills.</p>
            <button onClick={(e) => { e.stopPropagation(); navigate("/find-jobs"); }} className="premium-btn btn-blue w-full py-3 rounded-xl font-semibold">Find Jobs</button>
          </div>

          {/* CARD 4: AI INTERVIEW */}
          <div className="glass-card w-full max-w-xs p-8 flex flex-col items-center cursor-pointer" onClick={() => navigate("/ai-interview")}>
            <div className="icon-box icon-emerald mb-6"><Icons.Bot /></div>
            <h2 className="text-xl font-bold mb-3 text-gray-100">AI Interview Bot</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 flex-grow">Practice interview questions based on your resume and get a score.</p>
            <button onClick={(e) => { e.stopPropagation(); navigate("/ai-interview"); }} className="premium-btn btn-emerald w-full py-3 rounded-xl font-semibold">Start Interview</button>
          </div>

        </div>
      </div>
    </section>
  );
}