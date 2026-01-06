import fs from "fs";
import path from "path";
import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ answer: "No question provided." });
    }

    const policyPath = path.join(process.cwd(), "data", "policy.txt");

    if (!fs.existsSync(policyPath)) {
      return res.status(500).json({
        answer: "Policy file not found. Please upload a policy first.",
      });
    }

    const policyText = fs.readFileSync(policyPath, "utf8");

    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0,
      messages: [
        {
          role: "system",
          content: `
You are an HR assistant.
You must answer ONLY using the policy text below.
If the answer is not explicitly stated in the policy, reply:
"I’m sorry, that information is not available in the current policy."

POLICY:
${policyText}
          `,
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    res.status(200).json({
      answer: response.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ answer: "Error generating answer." });
  }
}
