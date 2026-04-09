import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png";
import "../styles/Navbar.css";

export default function Navbar() {

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const [activeSection, setActiveSection] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false); // ✅ FIX ADDED

  // ✅ HIDE NAVBAR FOR ADMIN
  if (location.pathname.startsWith("/admin")) {
    return null;
  }

  // ✅ SCROLL FUNCTION
  const scrollToSection = (id) => {
    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({
          behavior: "smooth"
        });
      }, 200);
    } else {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth"
      });
    }
  };

  // ✅ ACTIVE SECTION TRACK
  useEffect(() => {
    const sections = document.querySelectorAll("section");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.6 }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // ✅ CLOSE MENU ON OUTSIDE CLICK
  useEffect(() => {
    const handleClick = () => setMenuOpen(false);
    if (menuOpen) {
      window.addEventListener("click", handleClick);
    }
    return () => window.removeEventListener("click", handleClick);
  }, [menuOpen]);

  return (
    <div className="navbar-wrapper">

      <nav className="navbar">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-2 brand">
            <img src={logo} alt="Smart Resume Builder" className="w-10 h-10" />
            <span className="text-lg font-bold brand-text">
              Instant Resume Builder
            </span>
          </div>

          {/* CENTER (DESKTOP ONLY) */}
          <div className="hidden md:flex gap-8 font-medium">
            <span
              className={`nav-link ${activeSection === "home" ? "active-nav" : ""}`}
              onClick={() => scrollToSection("home")}
            >
              Home
            </span>

            <span
              className={`nav-link ${activeSection === "about" ? "active-nav" : ""}`}
              onClick={() => scrollToSection("about")}
            >
              About
            </span>

            <span
              className={`nav-link ${activeSection === "build-resume" ? "active-nav" : ""}`}
              onClick={() => scrollToSection("build-resume")}
            >
              Build Resume
            </span>

            <span
              className={`nav-link ${activeSection === "contact" ? "active-nav" : ""}`}
              onClick={() => scrollToSection("contact")}
            >
              Contact
            </span>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3">

            {/* ✅ MOBILE HAMBURGER */}
            <div className="md:hidden">
              <button
                onClick={(e) => {
                  e.stopPropagation(); // prevent auto close
                  setMenuOpen(!menuOpen);
                }}
                className="hamburger"
              >
                ☰
              </button>
            </div>

            {/* DESKTOP AUTH */}
            {!user ? (
              <div className="hidden md:flex gap-4">
                <Link to="/login" className="px-4 py-2 rounded-full border btn-outline">
                  Login
                </Link>
                <Link to="/signup" className="px-4 py-2 rounded-full btn-solid">
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <span className="font-medium hello-text">
                  Hello, <span className="username">{user.first_name}</span>
                </span>
                <button onClick={logout} className="px-4 py-2 rounded-full btn-solid">
                  Logout
                </button>
              </div>
            )}

          </div>
        </div>

        {/* ✅ MOBILE MENU (CORRECT POSITION) */}
        {menuOpen && (
          <div
            className="mobile-menu"
            onClick={(e) => e.stopPropagation()} // prevent close inside click
          >
            <span onClick={() => { scrollToSection("home"); setMenuOpen(false); }}>Home</span>
            <span onClick={() => { scrollToSection("about"); setMenuOpen(false); }}>About</span>
            <span onClick={() => { scrollToSection("build-resume"); setMenuOpen(false); }}>Build Resume</span>
            <span onClick={() => { scrollToSection("contact"); setMenuOpen(false); }}>Contact</span>

            {!user ? (
              <>
                <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)}>Sign Up</Link>
              </>
            ) : (
              <>
                <span>Hello, {user.first_name}</span>
                <button onClick={() => { logout(); setMenuOpen(false); }}>Logout</button>
              </>
            )}
          </div>
        )}

      </nav>
    </div>
  );
}