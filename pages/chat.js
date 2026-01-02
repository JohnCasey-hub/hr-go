import { useState } from "react";

export default function Chat() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async () => {
    if (!question) return;

    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await res.json();
    setAnswer(data.answer);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>HR-GO Chat</h1>
      <input
        type="text"
        placeholder="Ask a question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        style={{ width: "300px" }}
      />
      <button onClick={handleAsk} style={{ marginLeft: "10px" }}>
        Ask
      </button>
      {answer && (
        <div style={{ marginTop: "20px" }}>
          <strong>Answer:</strong>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
