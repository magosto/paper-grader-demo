# AI Security Paper Grader (Demo)

A two-part Angular + Node app for demonstrating prompt injection against an
AI-based grading system. Upload a PDF or DOCX paper about AI security /
prompt injection and an LLM grades it on grammar, length, formatting, and
content.

## Status

**Phase 1 (built):** the backend extracts raw text from the uploaded
document and passes it straight into the grading prompt, with no
sanitization. Text extraction pulls every character in the file, including
text that's invisible to a human reader (white-on-white, near-zero font
size, etc.), so a document with hidden instructions can manipulate the
grade the model returns.

**Phase 2 (not yet built):** detect and neutralize hidden/injected
instructions before grading, and surface a warning in the UI instead of
silently grading on manipulated input. The integration point for this is
`gradePaper()` in [backend/src/grader.ts](backend/src/grader.ts) — sanitize
`paperText` there before it's used to build the prompt.

## Project layout

- `frontend/` — Angular 20 app (upload UI + results).
- `backend/` — Express + TypeScript API. Extracts text from the upload and
  calls the Anthropic API to grade it.
- `sample-docs/` — generated test files: `clean-paper.docx` and
  `paper-with-hidden-injection.docx` (same paper, plus one paragraph of
  white 1pt text with a hidden grading override instruction).

## Setup

### Backend

```
cd backend
npm install
cp .env.example .env
# edit .env and set ANTHROPIC_API_KEY
npm run dev
```

Runs on http://localhost:3000.

### Frontend

```
cd frontend
npm install
npx ng serve
```

Runs on http://localhost:4200 and calls the backend at
`http://localhost:3000/api`.

## Trying the demo

1. Start both servers.
2. Open http://localhost:4200 and upload `sample-docs/clean-paper.docx` —
   note the grade.
3. Upload `sample-docs/paper-with-hidden-injection.docx` instead (identical
   visible content, plus invisible injected text) and compare the grade and
   summary. Use "Show extracted text sent to the grader" to see the hidden
   instruction that the model actually received.

To regenerate the sample files (e.g. after editing the paper text or the
injection payload in `backend/src/generateSamples.ts`):

```
cd backend
npm run gen:samples
```
