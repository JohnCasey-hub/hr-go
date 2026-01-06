import { setCookie } from "cookies-next";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { password } = req.body;
  if (password === process.env.ADMIN_UPLOAD_KEY) {
    setCookie("admin_logged_in", "true", { req, res, maxAge: 60 * 60 }); // 1 hour
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ success: false });
}
