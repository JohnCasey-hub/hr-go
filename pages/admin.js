import { useState } from "react";

export default function Admin() {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");

  async function handleUpload(e) {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    // Send the admin password (must match .env.local)
    formData.append("password", "hrgo-admin-123");

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
        credentials: "include", // ensures cookies are sent
      });

      const data = await res.json();
      setMessage(data.message);
    } catch (err) {
      setMessage("Upload failed. Check console for details.");
      console.error(err);
    }
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
