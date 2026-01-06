import fs from "fs";
import path from "path";
import { IncomingForm } from "formidable";
import { getCookie } from "cookies-next";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  // ✅ Check cookie instead of password
  const isAdmin = getCookie("admin_logged_in", { req, res }) === "true";
  if (!isAdmin) return res.status(401).json({ message: "Admin login required" });

  const uploadDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

  const form = new IncomingForm({ uploadDir, keepExtensions: true });

  form.parse(req, (err, fields, files) => {
    if (err) return res.status(500).json({ message: "Upload failed" });

    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;
    if (!uploadedFile || !uploadedFile.filepath)
      return res.status(400).json({ message: "No file uploaded" });

    const newPath = path.join(uploadDir, "policy.txt");
    try {
      fs.renameSync(uploadedFile.filepath, newPath);
    } catch {
      return res.status(500).json({ message: "Failed to save file" });
    }

    res.status(200).json({ message: "Policy uploaded successfully" });
  });
}
