import { setCookie } from "cookies-next";

export default function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();
  const { password } = req.body;

  if (password === process.env.ADMIN_UPLOAD_KEY) {
    // Set a secure cookie
    setCookie("admin_logged_in", "true", {
      req,
      res,
      httpOnly: true,
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });
    return res.status(200).json({ success: true });
  }

  return res.status(401).json({ success: false });
}
