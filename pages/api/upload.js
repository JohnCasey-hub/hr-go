import fs from "fs";
import path from "path";
import { IncomingForm } from "formidable";

export const config = {
  api: {
    bodyParser: false, // required for formidable
  },
};

export default async function handler(req, res) {
  const uploadDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const form = new IncomingForm({
    uploadDir,
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: "Upload failed" });
    }

    // 🔐 Admin password check
    const password = fields.password;
    if (password !== process.env.ADMIN_UPLOAD_KEY) {
      return res.status(401).json({ message: "Unauthorized: wrong password" });
    }

    // Support array or single file
    const uploadedFile = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!uploadedFile || !uploadedFile.filepath) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newPath = path.join(uploadDir, "policy.txt");

    try {
      fs.renameSync(uploadedFile.filepath, newPath);
    } catch (err) {
      return res.status(500).json({ message: "Failed to save file" });
    }

    res.status(200).json({ message: "Policy uploaded successfully" });
  });
}
