import { useState, useEffect } from "react";

export default function Admin() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [password, setPassword] = useState("");

  // Check if already logged in via cookie
  useEffect(() => {
    fetch("/api/check-login")
      .then((res) => res.json())
      .then((data) => setLoggedIn(data.loggedIn));
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (data.success) {
      setLoggedIn(true);
    } else {
      setMessage("Login failed: wrong password");
    }
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
      credentials: "include", // ⚠ important for cookies
    });

    const data = await res.json();
    setMessage(data.message);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>HR-GO Admin</h1>
      {!loggedIn ? (
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br /><br />
          <button type="submit">Login</button>
        </form>
      ) : (
        <form onSubmit={handleUpload}>
          <input
            type="file"
            accept=".txt"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <br /><br />
          <button type="submit">Upload Policy</button>
        </form>
      )}
      <p>{message}</p>
    </div>
  );
}