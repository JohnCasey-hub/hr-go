import OpenAI from "openai";

export default async function handler(req, res) {
  try {
    const { question } = req.body;

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `
You are HR-GO, an AI HR assistant. Only answer using this simple company policy:
"Employees are entitled to 28 days of paid holiday per year."

If the answer is not in that policy, say: "I can't find this information in your company policies."

Question: ${question}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    const answer = response.choices[0].message.content.trim();

    res.status(200).json({ answer });
  } catch (err) {
    console.error(err);
    res.status(500).json({ answer: "Error generating answer." });
  }
}
