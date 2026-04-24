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
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  // ✅ TRACK SCROLL FOR GLASS EFFECT
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="nav-wrapper">

      {/* Background blur layer */}
      <div className={`nav-blur-layer ${scrolled ? "nav-blur-active" : ""}`} />

      <nav className={`nav-glass ${scrolled ? "nav-scrolled" : ""} ${menuOpen ? "nav-menu-open" : ""}`}>
        <div className="nav-inner-container">

          {/* ── BRAND ── */}
          <div className="nav-brand" onClick={() => scrollToSection("home")}>
            <div className="nav-logo-ring">
              <img src={logo} alt="Smart Resume Builder" className="nav-logo-img" />
            </div>
            <span className="nav-brand-text">
              Instant Resume Builder
            </span>
          </div>

          {/* ── CENTER LINKS (DESKTOP) ── */}
          <div className="nav-links-desktop">
            {[
              { id: "home", label: "Home" },
              { id: "about", label: "About" },
              { id: "build-resume", label: "Build Resume" },
              { id: "contact", label: "Contact" },
            ].map((item) => (
              <span
                key={item.id}
                className={`nav-item ${activeSection === item.id ? "nav-item-active" : ""}`}
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
                {activeSection === item.id && <span className="nav-item-glow" />}
              </span>
            ))}
          </div>

          {/* ── RIGHT SIDE ── */}
          <div className="nav-right-section">

            {/* HAMBURGER (MOBILE) */}
            <button
              className={`nav-hamburger ${menuOpen ? "nav-hamburger-open" : ""}`}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen(!menuOpen);
              }}
              aria-label="Toggle menu"
            >
              <span />
              <span />
              <span />
            </button>

            {/* AUTH BUTTONS (DESKTOP) */}
            {!user ? (
              <div className="nav-auth-desktop">
                <Link to="/login" className="nav-btn-ghost">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
                  Login
                </Link>
                <Link to="/signup" className="nav-btn-primary">
                  Sign Up
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              </div>
            ) : (
              <div className="nav-user-desktop">
                <div className="nav-user-avatar">
                  {user.first_name?.[0]?.toUpperCase() || "U"}
                </div>
                <span className="nav-user-greet">
                  Hello, <span className="nav-user-name">{user.first_name}</span>
                </span>
                <button onClick={logout} className="nav-btn-logout">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                  Logout
                </button>
              </div>
            )}

          </div>
        </div>

        {/* ── MOBILE MENU ── */}
        <div className={`nav-mobile-panel ${menuOpen ? "nav-mobile-visible" : ""}`}>
          <div className="nav-mobile-inner" onClick={(e) => e.stopPropagation()}>
            <div className="nav-mobile-links">
              {[
                { id: "home", label: "Home" },
                { id: "about", label: "About" },
                { id: "build-resume", label: "Build Resume" },
                { id: "contact", label: "Contact" },
              ].map((item) => (
                <span
                  key={item.id}
                  className={`nav-mobile-item ${activeSection === item.id ? "nav-mobile-item-active" : ""}`}
                  onClick={() => { scrollToSection(item.id); setMenuOpen(false); }}
                >
                  {item.label}
                </span>
              ))}
            </div>

            <div className="nav-mobile-divider" />

            {!user ? (
              <div className="nav-mobile-auth">
                <Link to="/login" onClick={() => setMenuOpen(false)} className="nav-mobile-login">
                  Login
                </Link>
                <Link to="/signup" onClick={() => setMenuOpen(false)} className="nav-mobile-signup">
                  Sign Up
                </Link>
              </div>
            ) : (
              <div className="nav-mobile-auth">
                <div className="nav-mobile-user-info">
                  <div className="nav-mobile-avatar">
                    {user.first_name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <span>Hello, {user.first_name}</span>
                </div>
                <button
                  onClick={() => { logout(); setMenuOpen(false); }}
                  className="nav-mobile-logout"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

      </nav>
    </div>
  );
}