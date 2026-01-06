import fs from "fs";
import path from "path";
import { IncomingForm } from "formidable";
import { getCookie } from "cookies-next";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  // 🔐 Check admin cookie
  const isAdmin = getCookie("hrgo_admin", { req, res });
  if (!isAdmin) {
    return res.status(401).json({ message: "Unauthorized: admin login required" });
  }

  const uploadDir = path.join(process.cwd(), "data");
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }

  const form = new IncomingForm({
    multiples: false,
    keepExtensions: true,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error("FORM PARSE ERROR:", err);
      return res.status(500).json({ message: "Upload failed" });
    }

    console.log("FIELDS:", fields);
    console.log("FILES:", files);

    // ✅ Robust file extraction (works on Vercel)
    const fileKey = Object.keys(files)[0];
    const uploadedFile = Array.isArray(files[fileKey])
      ? files[fileKey][0]
      : files[fileKey];

    if (!uploadedFile || !uploadedFile.filepath) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newPath = path.join(uploadDir, "policy.txt");

    // ✅ Always overwrite
    fs.renameSync(uploadedFile.filepath, newPath);

    return res.status(200).json({ message: "Policy uploaded successfully" });
  });
}
