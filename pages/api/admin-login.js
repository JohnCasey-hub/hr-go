export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const { password } = req.body || {};

  if (password !== process.env.ADMIN_UPLOAD_KEY) {
    return res.status(401).json({ message: "Wrong password" });
  }

  res.setHeader(
    "Set-Cookie",
    `hrgo_admin=true; Path=/; HttpOnly; SameSite=Lax; Max-Age=28800`
  );

  return res.status(200).json({ message: "Logged in" });
}
