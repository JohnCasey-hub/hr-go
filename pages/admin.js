import { useState } from "react";

export default function Admin() {
  const [password, setPassword] = useState("");
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  async function login(e) {
    e.preventDefault();

    const res = await fetch("/api/admin-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password }),
    });

    const data = await res.json();
    setMessage(data.message);
  }

  async function upload(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload", {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await res.json();
    setMessage(data.message);
  }

  return (
    <div style={{ padding: 40 }}>
      <h1>Admin</h1>

      <form onSubmit={login}>
        <input
          type="password"
          placeholder="Admin password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>

      <br />

      <form onSubmit={upload}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button type="submit">Upload Policy</button>
      </form>

      <p>{message}</p>
    </div>
  );
}
