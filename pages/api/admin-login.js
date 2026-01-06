import { setCookie } from "cookies-next";

export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { password } = req.body;

  if (password === process.env.ADMIN_UPLOAD_KEY) {
    // Set a cookie to keep admin logged in for 1 hour
    setCookie("adminLoggedIn", "true", {
      req,
      res,
      httpOnly: true,
      path: "/",
      maxAge: 3600, // 1 hour
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production", // 🔒 Required for Vercel HTTPS
    });

    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: "Wrong password" });
  }
}
