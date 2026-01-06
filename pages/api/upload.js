import fs from "fs";
import path from "path";
import { IncomingForm } from "formidable";

export const config = {
  api: { bodyParser: false },
};

export default function handler(req, res) {
  const cookie = req.headers.cookie || "";

  if (!cookie.includes("hrgo_admin=true")) {
    return res.status(401).json({ message: "Unauthorized: admin login required" });
  }

  const form = new IncomingForm({ keepExtensions: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ message: "Upload failed" });
    }

    const file = Array.isArray(files.file) ? files.file[0] : files.file;

    if (!file?.filepath) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir);
    }

    fs.renameSync(
      file.filepath,
      path.join(dataDir, "policy.txt")
    );

    return res.status(200).json({ message: "Policy uploaded successfully" });
  });
}
