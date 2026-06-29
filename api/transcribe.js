import formidable from "formidable";
import fs from "fs";
import path from "path";

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const form = formidable({ keepExtensions: true });
  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: "Upload error" });

    const file = Array.isArray(files.audio) ? files.audio[0] : files.audio;
    if (!file) return res.status(400).json({ error: "No audio file" });

    const ext = path.extname(file.originalFilename || file.newFilename || "audio.webm").replace(".", "") || "webm";
    const mimeMap = { m4a: "audio/mp4", mp4: "audio/mp4", webm: "audio/webm", ogg: "audio/ogg" };
    const mime = mimeMap[ext] || "audio/webm";

    const formData = new FormData();
    formData.append(
      "file",
      new Blob([fs.readFileSync(file.filepath)], { type: mime }),
      `audio.${ext}`
    );
    formData.append("model", "whisper-1");
    formData.append("language", "en");
    formData.append("prompt", "HEPA, AFD, antimicrobial, plasterboard, skirting boards, subfloor, mould remediation, moisture readings, containment, IICRC, dehumidifier, zip door, encapsulation, category 2, category 3");

    const response = await fetch("https://api.openai.com/v1/audio/transcriptions", {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);

    res.status(200).json({ text: data.text });
  });
}
