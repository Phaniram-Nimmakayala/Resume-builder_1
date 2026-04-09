import './App.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from './pages/Home';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResumeOptions from "./pages/ResumeOptions";
import EditResume from "./pages/EditResume";
import CreateResume from "./pages/CreateResume";
import FindJobs from "./pages/FindJobs";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AIInterview from "./pages/AIInterview";


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
          <Route path="/resume-options" element={<ResumeOptions />} />
           <Route path="/edit-resume" element={<EditResume />} />
           <Route path="/create-resume" element={<CreateResume />} />
           <Route path="/find-jobs" element={<FindJobs />} />

           <Route path="/admin-dashboard" element={<AdminDashboard />} />
           <Route path="/admin-login" element={<AdminLogin />} />
           <Route path="/ai-interview" element={<AIInterview />} />

        </Routes>

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;