import { useState, useEffect } from "react";

export default function Admin() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function checkLogin() {
      const res = await fetch("/api/check-login");
      const data = await res.json();
      setLoggedIn(data.loggedIn);
    }
    checkLogin();
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.success) setLoggedIn(true);
    else alert(data.message);
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      credentials: "include"
    });
    const data = await res.json();
    setMessage(data.message);
  }

  if (!loggedIn) {
    return (
      <div style={{ padding: 40 }}>
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>HR-GO Admin – Upload Policy</h1>
      <form onSubmit={handleUpload}>
        <input type="file" accept=".txt" onChange={(e) => setFile(e.target.files[0])} />
        <br />
        <br />
        <button type="submit">Upload Policy</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
