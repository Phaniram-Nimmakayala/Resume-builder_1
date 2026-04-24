import { Link } from "react-router-dom";
import { useState } from "react";
import "../styles/Footer.css";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail("");
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const services = [
    { label: "Create Resume", icon: "create", to: "/create-resume" },
    { label: "Edit Resume", icon: "edit", to: "/edit-resume" },
    { label: "Find Jobs", icon: "jobs", to: "/find-jobs" },
    { label: "AI Interview", icon: "ai", to: "/ai-interview" },
  ];

  const quickLinks = [
    { label: "Home", icon: "home", to: "/" },
    { label: "Login", icon: "login", to: "/login" },
    { label: "Signup", icon: "signup", to: "/signup" },
    { label: "Contact", icon: "contact", to: "/#contact" },
  ];

  return (
    <footer className="footer-premium">
      <div className="footer-glow-border" />
      <div className="footer-orb footer-orb-1" />
      <div className="footer-orb footer-orb-2" />
      <div className="footer-orb footer-orb-3" />
      <div className="footer-dots" />

      <div className="footer-inner">
        <div className="footer-grid">

          {/* ── Brand Column ── */}
          <div className="footer-brand-col">
            <div className="footer-logo-wrap">
              <div className="footer-logo-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3l1.912 5.813h6.112l-4.969 3.574 1.912 5.813L12 14.626l-4.967 3.574 1.912-5.813L3.976 8.813h6.112z"/>
                </svg>
              </div>
              <h2 className="footer-logo-text">Smart Resume Builder</h2>
            </div>
            <p className="footer-tagline">
              Build professional resumes effortlessly with AI-powered tools.
              Designed to help you land your dream job faster.
            </p>

            <div className="footer-socials">
              <a href="#" className="footer-social-btn" aria-label="GitHub">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
              </a>
              <a href="#" className="footer-social-btn" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>
              <a href="#" className="footer-social-btn" aria-label="Twitter">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>

            <div className="footer-trust">
              <div className="footer-trust-dot" />
              <span>Trusted by 10,000+ users</span>
            </div>
          </div>

          {/* ── Services Column ── */}
          <div className="footer-link-col">
            <h3 className="footer-col-heading">
              <span className="footer-col-heading-accent" />
              Services
            </h3>
            <ul className="footer-link-list">
              {services.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="footer-link">
                    <span className="footer-link-icon">{getIcon(item.icon)}</span>
                    <span>{item.label}</span>
                    <svg className="footer-link-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Quick Links Column ── */}
          <div className="footer-link-col">
            <h3 className="footer-col-heading">
              <span className="footer-col-heading-accent" />
              Quick Links
            </h3>
            <ul className="footer-link-list">
              {quickLinks.map((item) => (
                <li key={item.to}>
                  <Link to={item.to} className="footer-link">
                    <span className="footer-link-icon">{getIcon(item.icon)}</span>
                    <span>{item.label}</span>
                    <svg className="footer-link-arrow" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17L17 7M17 7H7M17 7v10"/></svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Newsletter Column ── */}
          <div className="footer-newsletter-col">
            <h3 className="footer-col-heading">
              <span className="footer-col-heading-accent" />
              Stay Updated
            </h3>
            <p className="footer-newsletter-desc">
              Get career tips, resume trends, and exclusive updates delivered to your inbox.
            </p>
            <form className="footer-newsletter-form" onSubmit={handleSubscribe}>
              <div className="footer-input-wrap">
                <svg className="footer-input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M22 7l-10 7L2 7"/></svg>
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="footer-input"
                />
              </div>
              <button
                type="submit"
                className={`footer-subscribe-btn ${subscribed ? "footer-subscribed" : ""}`}
              >
                {subscribed ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>
                    Subscribed
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                    Subscribe
                  </>
                )}
              </button>
            </form>
            <p className="footer-newsletter-note">
              No spam. Unsubscribe anytime.
            </p>
          </div>

        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="footer-bottom-bar">
        <div className="footer-bottom-inner">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Smart Resume Builder &nbsp;·&nbsp; Developed by{" "}
            <svg className="footer-heart" width="13" height="13" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>{" "}
             <span className="footer-author">Phani Ram</span>
          </p>
          <div className="footer-bottom-links">
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ── Inline SVG Icon Helper ── */
function getIcon(name) {
  const icons = {
    create: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    edit: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    jobs: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
      </svg>
    ),
    ai: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a4 4 0 014 4c0 1.95-1.4 3.58-3.25 3.93"/><path d="M8.25 9.93A4 4 0 018 6a4 4 0 014-4"/><path d="M12 18v4"/><path d="M8 22h8"/><path d="M12 6v6l3 2"/>
      </svg>
    ),
    home: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    login: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>
      </svg>
    ),
    signup: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>
      </svg>
    ),
    contact: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
      </svg>
    ),
  };
  return icons[name] || null;
}