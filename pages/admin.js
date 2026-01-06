import { useState, useEffect } from "react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  // Check if already logged in
  useEffect(() => {
    fetch("/api/check-login")
      .then((res) => res.json())
      .then((data) => setLoggedIn(data.loggedIn))
      .catch(() => setLoggedIn(false));
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
      credentials: "include", // important to store cookie
    });
    const data = await res.json();
    if (data.success) {
      setLoggedIn(true);
      setMessage("Logged in!");
    } else {
      setMessage("Wrong password");
    }
  }

  async function handleUpload(e) {
    e.preventDefault();
    if (!file) return setMessage("Please select a file.");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      credentials: "include", // sends the admin cookie
    });
    const data = await res.json();
    setMessage(data.message);
  }

  if (!loggedIn) {
    return (
      <div style={{ padding: 40 }}>
        <h1>HR-GO Admin Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <br /><br />
          <button type="submit">Login</button>
        </form>
        <p>{message}</p>
      </div>
    );
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>HR-GO Admin – Upload Policy</h1>
      <form onSubmit={handleUpload}>
        <input
          type="file"
          accept=".txt"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <br /><br />
        <button type="submit">Upload</button>
      </form>
      <p>{message}</p>
    </div>
  );
}
