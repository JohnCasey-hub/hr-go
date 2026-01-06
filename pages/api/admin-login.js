export default function handler(req, res) {
  const { password } = req.body;

  if (password === process.env.ADMIN_UPLOAD_KEY) {
    // ✅ set cookie to keep admin logged in
    res.setHeader(
      "Set-Cookie",
      `adminLoggedIn=true; HttpOnly; Path=/; SameSite=Lax; Max-Age=3600`
    );
    return res.status(200).json({ success: true });
  } else {
    return res.status(401).json({ success: false, message: "Wrong password" });
  }
}
