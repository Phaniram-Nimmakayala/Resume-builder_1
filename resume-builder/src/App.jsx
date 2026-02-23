import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from './pages/Home';
import Login from "./pages/Login";
import Signup from "./pages/Signup";

import { AuthProvider } from "./context/AuthContext";

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>

        {/* Navbar Always Visible */}
        <Navbar />

        <Routes>

          {/* Landing Scroll Page */}
          <Route path="/" element={<Home />} />

          {/* Authentication Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;