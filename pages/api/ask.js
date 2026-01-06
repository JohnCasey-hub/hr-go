import OpenAI from "openai";
import fs from "fs";
import path from "path";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { question } = req.body;

  // Read policy file
  const policyPath = path.join(process.cwd(), "data/policy.txt");
  if (!fs.existsSync(policyPath)) {
    return res.status(400).json({ message: "No policy uploaded" });
  }
  const policyText = fs.readFileSync(policyPath, "utf8");

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const prompt = `
Policy document:
${policyText}

Employee question:
${question}

Answer based ONLY on the policy document above.
`;

    const response = await client.chat.completions.create({
      model: "gpt-4-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    res.status(200).json({ answer: response.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "Error generating answer." });
  }
}