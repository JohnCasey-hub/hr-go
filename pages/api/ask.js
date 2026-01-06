import fs from "fs";
import path from "path";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { question } = req.body;
  if (!question) return res.status(400).json({ answer: "No question provided." });

  try {
    // 1️⃣ Load company policy
    const policyPath = path.join(process.cwd(), "data", "policy.txt");
    const policyText = fs.existsSync(policyPath)
      ? fs.readFileSync(policyPath, "utf-8")
      : "No policy uploaded.";

    // 2️⃣ Build prompt
    const prompt = `
You are HR-GO, an AI HR assistant.
Use ONLY the following policy to answer the employee's question.
Policy:
${policyText}

Employee question: ${question}

Answer concisely in plain English, referencing the policy where possible.
`;

    // 3️⃣ Call OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const answer = response.choices?.[0]?.message?.content || "No answer generated.";
    res.status(200).json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "Error generating answer." });
  }
}
