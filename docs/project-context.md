# ATM (Assessment) — Project Context for UI

## 0) Purpose of this document
This document is the single source of truth for designing and building the **ATM assessment UI** (web). It consolidates:
- Product intent and user journeys
- Screen inventory and information architecture
- UI behaviors and component specs
- Constraints implied by the generation/grading pipeline
- Open questions and decisions that must be locked for the next release

**Primary goal:** enable consistent UI implementation (and iteration) without re-reading long email threads.

## 1) What we’re building
ATM lets students **create their own assessments** from their CBSE curriculum content and get **automatic grading + actionable feedback**.

### Board + scope (current)
- **Board:** CBSE
- **Class:** X (10)
- **Subjects (initial):** English, Science, Social

### Supported assessment experiences
Students can:
1. **Create an assessment** (3 personas / modes)
2. **Take it digitally** in the web UI OR **use paper & pen** via a print-ready PDF + OCR-friendly answer template
3. **Submit** (digital answers or uploaded answer sheets)
4. **Receive a feedback report** (question-level correctness + actionable summary)

## 2) Key artifacts in this repo
- Wireframe PDF: [reatminitialflow/ATM flow wireframe.pdf](../reatminitialflow/ATM%20flow%20wireframe.pdf)
- Supporting screenshots (reference):
  - [reatminitialflow/image1.jpeg](../reatminitialflow/image1.jpeg)
  - [reatminitialflow/WhatsApp Image 2025-12-18 at 12.23.47.jpeg](../reatminitialflow/WhatsApp%20Image%202025-12-18%20at%2012.23.47.jpeg)
  - [reatminitialflow/WhatsApp Image 2025-12-18 at 12.23.48.jpeg](../reatminitialflow/WhatsApp%20Image%202025-12-18%20at%2012.23.48.jpeg)
  - [reatminitialflow/WhatsApp Image 2025-12-18 at 12.56.42.jpeg](../reatminitialflow/WhatsApp%20Image%202025-12-18%20at%2012.56.42.jpeg)

## 2.1) Stakeholder feedback incorporated (and how it shows up in UI)
This captures the specific feedback from content/AI/tech stakeholders and where it is represented in the UI spec.

### Incorporated into the UI requirements
- **Rename “Manual” → “Print”**: reflected in Format toggle and language throughout.
- **Explain Quick vs Practice vs Chapter-wise**: required via **info (i) tooltips** and microcopy.
- **Question count increments of 5**: 5/10/15/20/25/30.
- **Pre-generation student info**: name, grade, age, country/state, board, school, subject.
- **Print workflow**: printable PDF + OCR-friendly answer template + upload (multi-image + PDF).
- **Upload UX**: “take a photo/scan” option + clear capture instructions.
- **Difficulty naming clarity**: separates student-facing Difficulty (Easy/Medium/Hard) from internal Bloom/language metadata.
- **CBSE-aligned grading**: uses a CBSE-inspired rubric (Content/Expression/Accuracy) to avoid rigid “every value point” requirements.

### Explicitly tracked but still pending product decisions
- **Retake meaning** (same paper vs incorrect-only vs new set on same topic).
- **Print MCQ marking** (A/B/C/D vs bubbles).
- **Question type composition + Bloom’s distribution** defaults per persona.
- **Assessment history/account** (needed to support uploads against older assessments).

## 3) Personas & their “jobs to be done”
ATM supports three user intents (“personas” in the product sense):

### A) Chapter-wise assessment (1–5 chapters)
- **User intent:** “Test me on the chapters I choose.”
- **Controls:** choose chapters (multi-select, 1–5), question count, difficulty/level, digital vs print.

### B) Practice assessment (full)
- **User intent:** “Give me a fuller practice set to build mastery.”
- **Controls:** subject + broad chapter set (may be “all selected” by default), question count, difficulty/level, digital vs print.

### C) Quick mini assessment (“I have 10 minutes”)
- **User intent:** “I only have 10 minutes—help me refresh.”
- **Controls:** minimal clicks; the system should default composition and keep choices lightweight.

## 4) High-level user journey (end-to-end)
User-facing journey naming (from user POV):
1. **Creating assessment**
2. **Taking the assessment (digital)** OR **Printing & writing (print)**
3. **Submitting**
4. **Getting feedback report**

### Journey overview
- Entry: student chooses **Create new assessment** or **Upload answer sheet for grading**
- Setup: student chooses grade, subject, chapters, difficulty/level, question count, format (digital/print)
- Generate: system composes the assessment from the question bank
- Take:
  - Digital: interactive question screens
  - Print: download PDF + answer template
- Submit:
  - Digital: submit answers
  - Print: upload photos/PDF of answer sheets
- Report: correctness + feedback + next action

## 5) Screen inventory (UI map)
This is the minimal set required by the described UX.

### S0 — Entry
- Options:
  - Create a new assessment
  - Upload answer sheet for grading (print workflow)

### S1 — Student context (before generation)
Collect or confirm:
- Name (typed)
- Grade (dropdown; currently 6–11 mentioned in feedback; for now, **Class X** must be supported)
- Age (typed)
- Country → if India, State
- Curriculum/Board: CBSE (locked for now)
- School (typed)
- Subject (dropdown; single-select)

### S2 — Choose assessment type
Buttons:
- Chapter-wise
- Practice
- Quick

Each label should have an **info (i) tooltip** with a micro-description.

### S3 — Configure assessment
Common controls (varies by type):
- Chapters: multi-select (enforce 1–5 for chapter-wise)
- Difficulty/Level: dropdown (see “Level” definition below)
- Number of questions:
  - Prefer increments of 5: 5/10/15/20/25/30
  - (Decision pending: dropdown vs manual input with validation)
- Format: Digital vs Print
- Generate CTA

Optional (scope-dependent, but requested in feedback):
- After generation, allow the user to **shuffle** or **remove** questions and regenerate the paper.

### S4 — Generated assessment (digital)
- Digital “taking” UI:
  - **1–2 questions per screen** to avoid overwhelm
  - Progress indicator (e.g., 1/20)
  - Timer if assessment is timeboxed (optional; depends on Quick definition)
  - Navigation: Next/Previous
  - Submit CTA

### S5 — Generated assessment (print)
- Download/Print:
  - Download PDF of the question paper
  - Download/print OCR-friendly answer sheet template
- Then proceed to upload flow

### S6 — Upload answer sheet (print submit)
- Instructions panel (clear photo capture guidance)
- Upload control:
  - Upload PDF
  - Upload images (multi-image)
  - Option to take photo/scan
- Submit for grading CTA

### S7 — Feedback report
- Score summary (e.g., 15/20)
- Question-by-question correctness
- Actionable feedback (1–2 short paragraphs, specific next steps)
- Next actions:
  - Retake
  - New assessment
  - Exit

## 6) “Level” and “Difficulty” — UI definition
The wireframes show “Select Level”; product notes mention “difficulty” and backend mentions “language difficulty” + Bloom’s taxonomy.

To avoid user confusion, the UI must clearly name what “Level” means.

### Recommended UI naming
- **Difficulty:** Easy / Medium / Hard (student-facing)
- Bloom’s distribution: hidden by default; optionally advanced (teacher-facing) later

### Mapping (assumption)
- Difficulty drives a combination of:
  - language complexity
  - Bloom’s level weights
  - question type mix

If the product requires Bloom’s controls in UI, rename the control explicitly to **“Bloom’s focus”** and keep it behind an “Advanced” panel.

## 7) Core components & behaviors

### Assessment type buttons
- Each has an info (i) tooltip.
- Tooltip content must define:
  - typical duration
  - typical number of questions
  - what content is included (chapters chosen vs full)

### Chapters selector (multi-select)
- Multi-select with checkboxes.
- Must enforce max chapters (1–5) for chapter-wise.
- Show selected count and error state if limit exceeded.

### Question count selector
- Default: dropdown with increments of 5.
- Validation rules:
  - min 5
  - max 30 (initial)
  - if not enough questions available in bank: show fallback messaging (see Edge cases)

### Format toggle
- Use labels:
  - **Digital**
  - **Print (PDF + upload for grading)** (rename “Manual” → “Print”)

### Digital question renderer
Supports these question types:
- MCQ (single-select)
- Fill-in-the-blanks
- Short answer (1–2 lines typical)
- Long answer (3–5 lines typical)

For subjective in digital:
- Input = typed text
- Mic icon may be shown as a future enhancement (voice-to-text); for MVP it can be present but disabled or hidden depending on scope.

### Print outputs
- Question paper is printable
- Answer sheet template is OCR-friendly
- MCQ capture approach (decision):
  - A/B/C/D letter entry OR
  - bubble sheets

Optional (scope-dependent, but requested in feedback):
- Provide a “shuffle/remove questions” capability post-generation before downloading the final PDF.

### Upload component (print submit)
- Must support:
  - PDF
  - image formats (at least JPEG; decision includes PNG; HEIC is optional)
- Multi-image upload (front/back pages)
- Clear file limits and progress state

### Feedback report
- Must show:
  - per-question correctness
  - summary feedback (actionable)
- Optional (future): concept tags, Bloom breakdown, “view solutions”

## 8) Edge cases the UI must handle

### Not enough questions in the bank
If the bank cannot satisfy composition for the selected chapters/level/count:
- UI should show a clear message and offer one or more of:
  - reduce question count
  - widen chapter selection
  - switch difficulty to “Default”

### Retake meaning (open)
Retake can mean:
- same questions again
- only incorrect questions
- new set from same topic/chapters

UI impact:
- label the button clearly once decision is locked (e.g., “Retry incorrect” vs “New set”).

### Upload mismatch
If user uploads answer sheets for an assessment that cannot be identified:
- UI must allow selecting which assessment the upload belongs to (future if history exists)
- For MVP, enforce a single “upload right after print” flow to avoid ambiguity.

### Subject-specific question types (English)
English may require types beyond MCQ/FIB/short/long (e.g., comprehension passages with sub-questions, writing tasks).
UI must be extensible:
- allow grouped questions (passage + multiple items)
- allow a “prompt + long answer” pattern

## 9) Backend pipeline constraints that influence UI
(These inform what knobs should exist and what users should not have to decide.)

### Question generation → bank
- Source: NCERT curriculum/textbooks
- Generate question+answer pairs
- Quality checks:
  - Bloom’s taxonomy alignment
  - assessment priority level
  - accuracy of Q/A pair
  - language
- Pass → store in question bank with metadata
- Fail → reviewed / re-assessed / discarded

### Paper composition
- Inputs: chapters chosen + composition instructions
- Final check: priority + Q/A accuracy
- Output: paper generated

### Evaluation / grading
- Rubric: CBSE-inspired **Content / Expression / Accuracy**
- Prefer avoiding “every value point” as a strict requirement; use reference answers + rubric scoring.

### Feedback generation
- Generate rationale → generate actionable feedback
- Feedback should be specific (“next steps”) and concise.

## 10) UI acceptance criteria (MVP)
Use these as UI “definition of done”.

### Creating assessment
- User can select assessment type (chapter-wise/practice/quick).
- User can select subject and chapters (chapter-wise enforces 1–5).
- User can pick Digital or Print.
- User can pick question count in increments of 5.
- User can pick Difficulty (Easy/Medium/Hard).
- User can generate assessment without ambiguous terminology.

### Taking assessment (digital)
- Questions are displayed 1–2 per screen.
- User can answer MCQs, FIB, short, long questions.
- User can navigate Next/Previous.
- User can submit.

### Print + upload
- User can download a printable PDF.
- User can download/print an OCR-friendly answer template.
- User can upload multiple images or a PDF.
- User sees clear capture instructions.

### Feedback report
- User sees score + question-level correctness.
- User sees 1–2 paragraphs of actionable feedback.
- User has a clear next action (Retake/New/Exit).

## 11) Open questions to resolve (to unblock UI finalization)
These are the minimum decisions needed to avoid UX rework.

1. **Quick vs Practice definitions**
   - Is Quick strictly 10 minutes timeboxed or just “small set”? If timeboxed, the UI must include timer + auto-submit.
2. **Retake semantics**
   - Entire test vs incorrect-only vs new set same topic.
3. **MCQ capture in print template**
   - A/B/C/D writing vs bubbles.
4. **Supported OCR upload formats**
   - Confirm: PDF + JPEG; decide on PNG/HEIC.
5. **English-specific formats**
   - Comprehension passages + writing tasks support.
6. **Question count control**
   - Dropdown vs numeric input.
7. **History / assessment tracking**
   - Is there an account system in MVP? If not, avoid UI that depends on selecting old assessments during upload.

8. **Shuffle/remove questions (post-generation)**
  - Is this in MVP for both Digital and Print, or a V2 enhancement?

## 12) Suggested microcopy (tooltips)
Keep these short and consistent.

- Quick: “A short set of questions for fast revision.”
- Practice: “A longer set to build deeper mastery.”
- Chapter-wise: “Choose 1–5 chapters and generate a custom set.”
- Print: “Print a paper + OCR answer sheet, then upload for grading.”

## 13) Screen-by-screen UI spec (implementation-ready)
This section defines the UI at the level needed to build screens and components with minimal back-and-forth.

### 13.1 Global UI conventions
- **Platform:** web (mobile-first responsive).
- **Header:** “ATM” title + back navigation.
- **Primary CTA:** one primary button per screen.
- **Required fields:** primary CTA is disabled until required inputs are valid.
- **Error states:** inline, under the field; keep language simple (“Select a subject”).
- **Persisted state:** keep the selected assessment configuration while navigating within the create/take/report journey.

### 13.2 S0 — Entry
**Goal:** choose the path.

**UI elements**
- Primary button: **Create a new assessment**
- Secondary button: **Upload answer sheet for grading**

**Behavior**
- Create a new assessment → S1.
- Upload answer sheet for grading → S6 (if assessment tracking is not available in MVP, this path should still work but may require a single-session upload; see Open questions).

### 13.3 S1 — Student context (before generation)
**Goal:** collect/confirm basic student context.

**Fields (required unless specified)**
- Name (text)
- Grade (dropdown)
  - Options: 6–11 (must include **10**)
- Age (number, integer)
- Country (dropdown)
- State (dropdown; required only if Country = India)
- Curriculum/Board (read-only): CBSE
- School (text; optional for MVP if needed)
- Subject (dropdown)
  - Options: English, Science, Social

**Validation**
- Name: non-empty
- Grade: selected
- Age: 5–25 (soft validation; adjust as needed)
- Country: selected
- State: required if India
- Subject: selected

**CTA**
- Primary: **Continue** → S2

### 13.4 S2 — Choose assessment type
**Goal:** pick assessment intent with minimal confusion.

**UI**
- Three primary options (cards or large buttons):
  - Chapter-wise
  - Practice
  - Quick
- Each has an info (i) tooltip. Use the microcopy in section 12.

**Behavior**
- Selecting an option routes to S3 with defaults appropriate to the type.

### 13.5 S3 — Configure assessment
**Goal:** capture chapters, size, difficulty, and format; then generate.

**Common UI elements**
- Subject (read-only display of S1 choice with “Change” link back to S1)
- Chapters selector (multi-select)
- Difficulty (dropdown): Easy / Medium / Hard
- Number of questions (dropdown): 5/10/15/20/25/30
- Format selector:
  - Digital
  - Print (PDF + upload for grading)
- Primary CTA: **Generate**

**Type-specific rules**
- Chapter-wise:
  - Chapters required; enforce 1–5 selected.
- Practice:
  - Default chapters = “All chapters” (can be represented as all selected; user may unselect if supported).
- Quick:
  - Defaults:
    - Number of questions = 10 (or 5 if that’s preferred)
    - Difficulty = Medium
    - Chapters: allow selection but keep it lightweight (preselect recent/top chapters if available; otherwise allow user to choose).

**Validation**
- Chapters:
  - Chapter-wise: must be 1–5
  - Practice/Quick: must be ≥1 (unless “All chapters” is used)
- Question count: required
- Difficulty: required
- Format: required

**Edge case messaging**
- If not enough questions available (bank constraint):
  - Show inline banner: “Not enough questions available for this selection. Try fewer questions, more chapters, or a different difficulty.”

**Navigation**
- Generate (Digital) → S4
- Generate (Print) → S5

### 13.6 S4 — Taking the assessment (Digital)
**Goal:** take the assessment in a simple, non-overwhelming way.

**Layout**
- Top row:
  - Progress indicator: “Question 1 of 20”
  - Optional timer (only if Quick becomes timeboxed)
- Body:
  - Render **one question per screen** by default (optionally 2 for very short items, but keep it consistent).
- Bottom:
  - Buttons: **Previous** (disabled on first), **Next** (becomes **Submit** on last)

**Question rendering rules**
- MCQ:
  - single-select options (radio behavior)
- Fill-in-the-blanks:
  - single-line input
- Short answer:
  - multi-line textarea (short)
- Long answer:
  - multi-line textarea (taller)

**Behavior**
- Answers are stored locally in memory for the session.
- Next is enabled once the current question has an answer (MVP). If you want to allow skipping, remove this rule.
- Submit on last question navigates to S7.

### 13.7 S5 — Print package (PDF + answer sheet)
**Goal:** provide the printable paper + OCR template and guide the user to upload.

**UI**
- Section: “Your assessment is ready”
- Buttons:
  - **Download question paper (PDF)**
  - **Download answer sheet template (PDF)**
- Below: short note “Complete on paper, then upload for automatic grading.”

**CTA**
- Primary: **Upload answer sheet** → S6

### 13.8 S6 — Submit (Upload answer sheet)
**Goal:** upload files with clear instructions to maximize OCR quality.

**UI**
- Instructions block (must be visible by default):
  - Good lighting
  - Keep sheet flat
  - Ensure full page is visible
  - Avoid blur
- Upload control:
  - **Upload images** (multi-select)
  - **Upload PDF**
  - Optional: “Take photo/scan” shortcut (if supported by platform)
- File list with remove actions
- Primary CTA: **Submit for grading**

**Validation**
- Require at least 1 file.
- Allow only approved types (Open question #4); until confirmed, accept PDF + JPEG (+ PNG if needed).

**Behavior**
- Show upload progress and a clear success/failure state.
- On success → S7

### 13.9 S7 — Feedback report
**Goal:** show outcome + actionable next steps.

**UI**
- Header: “Result: 15/20” (or percentage)
- List: questions with correctness indicators (✓/✗)
- Section: “Actionable feedback”
  - 1–2 short paragraphs
  - Must include at least one concrete next step (“Review Chapter 2 and retry similar questions”).
- Buttons:
  - **Retake** (definition pending)
  - **New assessment** (back to S2)
  - **Exit** (back to S0)

**Notes on grading alignment (Ketan’s point)**
- Feedback should not depend on enumerating every CBSE value point; it should be derived from rubric-based rationale (Content/Expression/Accuracy) against reference answers.

---

If you want, I can use this doc to produce a concrete UI spec next (component-by-component layout rules and exact screen-by-screen wireframe text), tailored to your design system.

---

# Part 2: UI Implementation Plan — HTML + JS for Android

## 14) Project Structure

```
atm/
├── docs/
│   └── project-context.md          # This file (requirements + UI spec + plan)
├── reatminitialflow/               # Wireframes + reference images
├── web/                            # ← NEW: All UI source code
│   ├── index.html                  # App shell + root container
│   ├── assets/icons/, images/      # App icons and UI images
│   ├── styles/
│   │   ├── main.css                # Global styles + CSS variables
│   │   ├── components.css          # Reusable component styles
│   │   └── screens.css             # Screen-specific styles
│   ├── templates/                  # HTML templates (s0-entry.html … s7-report.html)
│   └── js/
│       ├── app.js                  # Bootstrap + router + appState
│       ├── api.js                  # Backend API (mocked initially)
│       ├── controllers/            # s0Entry.js … s7Report.js
│       └── components/             # header, tooltip, multiSelect, questionRenderer, fileUploader, progressBar
└── android/                        # Android WebView wrapper project
```

## 15) Foundation

### 15.1 App Shell (`web/index.html`)
Mobile-first viewport; loads `main.css`, `components.css`, `screens.css`; contains `<div id="app"><header id="app-header"></header><main id="app-content"></main></div>`; entry script `js/app.js` (module).

### 15.2 State (`appState` in `app.js`)
- `studentContext`: name, grade, age, country, state, board (CBSE), school, subject
- `assessmentType`: 'chapter-wise' | 'practice' | 'quick'
- `config`: chapters[], difficulty, questionCount, format ('digital'|'print')
- `generatedAssessment`: id, questions[], pdfUrl, answerSheetUrl
- `answers`: { questionId: value }
- `currentQuestionIndex`
- `uploadedFiles`
- `report`

### 15.3 Router
Routes object maps S0–S7 → template + controller; `navigate(screenId)` fetches template into `#app-content` and calls `controller.init(appState)`.

### 15.4 CSS Variables (brand)
`--color-primary: #9B4D6E` (header), `--color-accent: #F5B642` (CTAs), `--color-success`, `--color-error`, spacing scale, `--radius: 8px`.

---

## 16) Screen-by-Screen Implementation

### S0 — Entry
Two large buttons: **Create a new assessment** → S1; **Upload answer sheet for grading** → S6.

### S1 — Student Context
Form: name, grade (6–11), age, country (India → show state), board (CBSE locked), school (optional), subject (English/Science/Social). Validate → Continue → S2.

### S2 — Assessment Type
Three cards with info tooltips (microcopy from §12): Chapter-wise, Practice, Quick. On select → set defaults → S3.

### S3 — Configure
- Subject display + Change link
- Chapters multi-select (1–5 for chapter-wise)
- Difficulty dropdown (Easy/Medium/Hard)
- Question count dropdown (5/10/15/20/25/30)
- Format toggle (Digital / Print)
- Generate → call API → S4 (digital) or S5 (print)
- Error banner if not enough questions

### S4 — Digital Taking
- Progress (Question X of Y) + progress bar
- One question per screen; `questionRenderer` for MCQ/FIB/short/long
- Save answer on change
- Prev/Next; Submit on last → API → S7

### S5 — Print Download
- Success icon + message
- Download Question Paper PDF
- Download Answer Sheet Template
- Upload Answer Sheet → S6

### S6 — Upload
- Instructions panel (lighting, flat, visible, no blur)
- File picker (PDF/JPEG/PNG, multi)
- File list with remove
- Submit (enabled when ≥1 file) → API → S7

### S7 — Report
- Score: X/Y (%)
- Per-question ✓/✗ list
- Actionable feedback (strengths, improvements, next steps)
- Buttons: Retake (→ S4/S5), New Assessment (→ S2), Exit (→ S0)

---

## 17) Reusable Components

| Component | Purpose |
|-----------|---------|
| `header.js` | App header + back nav |
| `tooltip.js` | Info tooltips |
| `multiSelect.js` | Chapters selector (max limit) |
| `questionRenderer.js` | MCQ/FIB/short/long |
| `fileUploader.js` | Multi-file upload + preview |
| `progressBar.js` | Progress indicator |

---

## 18) Android Packaging

**Option A (MVP): WebView wrapper**
1. Android Studio Empty Activity
2. Copy `web/` → `app/src/main/assets/www/`
3. Load `file:///android_asset/www/index.html` in WebView with JS enabled

**Option B: Capacitor** (if native features needed later)
`npx cap init ATM com.pratham.atm --web-dir=web && npx cap add android`

---

## 19) Timeline

| Week | Tasks |
|------|-------|
| 1 | Foundation + S0, S1, S2 |
| 2 | S3, S4, S5, S6 |
| 3 | S7, polish, Android packaging, testing |

---

## 20) Testing Checklist

- [ ] S0: Both paths navigate
- [ ] S1: Validation, state conditional, board locked
- [ ] S2: Tooltips, selection persists
- [ ] S3: Chapter limit, error banner
- [ ] S4: All question types, answers persist
- [ ] S5: PDF downloads, upload path
- [ ] S6: Multi-file, submit enabled
- [ ] S7: Score, feedback, actions work
- [ ] Android: WebView loads, file upload works

---

*Plan created: December 19, 2025*
