import { useEffect, useState } from "react";
import "../styles/AdminDashboard.css";

export default function AdminDashboard() {

  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);

  const [usersCount, setUsersCount] = useState(0);
  const [messagesCount, setMessagesCount] = useState(0);
  const [resumeCount, setResumeCount] = useState(0);

  const [activeView, setActiveView] = useState("dashboard");

  // ✅ ADD THIS LINE
  const token = localStorage.getItem("adminToken");

  // 🔐 PROTECT ROUTE
  useEffect(() => {
    if (!token) {
      window.location.href = "/admin-login";
    }
  }, []);

  // 🔥 FETCH USERS
  useEffect(() => {
  fetch("http://127.0.0.1:8000/api/admin-users/", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => {
      if (!res.ok) {
        throw new Error("Unauthorized or API error");
      }
      return res.json();
    })
    .then(data => {
      console.log("Users API:", data); // 🔥 DEBUG

      setUsers(data);

      // ✅ IMPORTANT: fallback count
      setUsersCount(data.length);
    })
    .catch(err => {
      console.log("Users fetch error:", err);
    });
}, [token]);

  // 🔥 FETCH MESSAGES
  useEffect(() => {
  fetch("http://127.0.0.1:8000/api/admin-messages/", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then(res => res.json())
    .then(data => {
      console.log("Messages API:", data);
      setMessages(data);

      // optional fallback
      setMessagesCount(data.length);
    })
    .catch(err => console.log(err));
}, [token]);

  // 🔥 FETCH STATS
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/admin-stats/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setUsersCount(data.users);
        setMessagesCount(data.messages);
        setResumeCount(data.resumes);
      })
      .catch(err => console.log(err));
  }, []);

  return (
  <div className="admin-page">

    {/* SIDEBAR */}
    <div className="admin-sidebar">
      <h2>Admin Panel</h2>

      <ul>
        <li onClick={() => setActiveView("dashboard")}>🏠 Dashboard</li>
        <li onClick={() => setActiveView("users")}>👤 Users</li>
        <li onClick={() => setActiveView("messages")}>💬 Messages</li>
      </ul>
    </div>

    {/* MAIN */}
    <div className="admin-main">

      <h1>Dashboard</h1>

      {/* STATS */}
      <div className="stats-grid">

        <div className="stat-card users-card">
          <div className="icon">👤</div>
          <h3>{usersCount}</h3>
          <p>Total Users</p>
          <button onClick={() => setActiveView("users")}>View</button>
        </div>

        <div className="stat-card messages-card">
          <div className="icon">💬</div>
          <h3>{messagesCount}</h3>
          <p>Messages</p>
          <button onClick={() => setActiveView("messages")}>View</button>
        </div>

      </div>

      {/* DEFAULT */}
      {activeView === "dashboard" && (
        <p style={{ marginTop: "20px" }}>
          Select a section from sidebar or cards
        </p>
      )}

      {/* USERS */}
      {activeView === "users" && (
        <div className="table-section">

          <div className="section-header">
            <h2>Users</h2>
            <button onClick={() => setActiveView("dashboard")}>
              ← Back
            </button>
          </div>

          <table>
            <thead>
              <tr>
                <th>Email</th>
                <th>Mobile</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {users.map((u, i) => (
                <tr key={i}>
                  <td>{u.email}</td>
                  <td>{u.mobile}</td>
                  <td>{u.is_active ? "Active" : "Blocked"}</td>
                </tr>
              ))}
            </tbody>
          </table>

        </div>
      )}

      {/* MESSAGES */}
      {activeView === "messages" && (
        <div className="table-section">

          <div className="section-header">
            <h2>Messages</h2>
            <button onClick={() => setActiveView("dashboard")}>
              ← Back
            </button>
          </div>

          {messages.map((m, i) => (
            <div key={i} className="message-card">
              <p><b>{m.name}</b> ({m.email})</p>
              <p>{m.message}</p>
            </div>
          ))}

        </div>
      )}

    </div>
  </div>
);
}