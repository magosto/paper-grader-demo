import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import { extractText, isSupportedMimeType } from "./textExtractor";
import { gradePaper } from "./grader";

const app = express();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
});

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/grade", upload.single("file"), async (req, res) => {
  const file = req.file;

  if (!file) {
    res.status(400).json({ error: "No file uploaded. Attach a PDF or DOCX under 'file'." });
    return;
  }

  if (!isSupportedMimeType(file.mimetype)) {
    res.status(400).json({ error: `Unsupported file type: ${file.mimetype}. Upload a PDF or DOCX.` });
    return;
  }

  try {
    const text = await extractText(file.buffer, file.mimetype);

    if (!text) {
      res.status(422).json({ error: "No extractable text was found in the file." });
      return;
    }

    const grade = await gradePaper(text);
    res.json({ grade, extractedText: text });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Unknown error while grading paper.";
    res.status(500).json({ error: message });
  }
});

const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log(`Paper grader backend listening on http://localhost:${PORT}`);
});
