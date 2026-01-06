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

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
      credentials: "include", // ✅ send login cookie
    });

    const data = await res.json();
    setMessage(data.message);
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
