import { Link, useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import logo from "../assets/logo.png"; // add your icon image here
import "../styles/Navbar.css"; 

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  const navigate = useNavigate();
const location = useLocation();

const scrollToSection = (id) => {

  // If user not on home page
  if (location.pathname !== "/") {
    navigate("/");

    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({
        behavior: "smooth"
      });
    }, 200);
  } 
  else {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    });
  }
};

  return (
    <div className="navbar-wrapper">
    <nav className="navbar">
      <div className="max-w-7xl mx-auto px-8 py-3 flex items-center justify-between">

        {/* LEFT: Brand */}
        <div className="flex items-center gap-0 brand">
          <img
            src={logo}
            alt="Smart Resume Builder"
            className="w-13 h-13"
          />
          <span className="text-xl font-bold tracking-wide brand-text">
            Instant Resume Builder
          </span>
        </div>

        <div className="hidden md:flex gap-8 font-medium">

  <span
    className="nav-link cursor-pointer"
    onClick={() => scrollToSection("home")}
  >
    Home
  </span>

  <span
    className="nav-link cursor-pointer"
    onClick={() => scrollToSection("about")}
  >
    About
  </span>

  {/* Future sections */}
  {/* enable later when created */}

  {/* 
  <span onClick={() => scrollToSection("resources")}>
    Resources
  </span>

  <span onClick={() => scrollToSection("contact")}>
    Contact
  </span>
  */}

  {/* REAL PAGE */}
  <Link to="/build-resume" className="nav-link">
    Build Resume
  </Link>

</div>

        {/* RIGHT: Auth Buttons */}
        {!user ? (
          <div className="flex gap-4">
            <Link
              to="/login"
              className="px-4 py-2 rounded-full border btn-outline"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="px-4 py-2 rounded-full btn-solid"
            >
              Sign Up
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <span className="font-medium hello-text">
              Hello, <span className="username">{user.first_name}</span>
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 rounded-full btn-solid"
            >
              Logout
            </button>
          </div>
        )}

      </div>
    </nav>
  </div>
  );
};

export default Navbar;
