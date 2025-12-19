# Stakeholder Feedback Incorporated — By Screen

This document maps each screen (S0–S7) to the specific stakeholder feedback that was considered during implementation.

---

## S0 — Entry Screen

### Feedback Incorporated

| Stakeholder | Feedback | How It's Addressed |
|-------------|----------|-------------------|
| **Sravana** | Need clarity on the upload flow—when does a user upload vs create new? | Entry screen provides two distinct CTAs: "Create Assessment" vs "Upload Answer Sheet", making the flow choice explicit upfront |
| **Rahee** | Print workflow should be first-class, not hidden | "Upload Answer Sheet" is a primary button on entry, not buried in menus |
| **General** | Users may return to upload after printing elsewhere | Direct upload path from entry supports returning users who printed earlier |

### Design Decisions
- Two equal-weight buttons to avoid bias toward digital-only
- Upload path supports OCR grading for handwritten answers

---

## S1 — Student Context Screen

### Feedback Incorporated

| Stakeholder | Feedback | How It's Addressed |
|-------------|----------|-------------------|
| **Nishant** | Student info must be collected pre-generation for personalization and analytics | Form collects: Name, Grade, Age, Country/State, Board, School, Subject before any assessment is created |
| **Sravana** | Grade range should support 6–11 (not just Class X) | Dropdown includes grades 6–11 |
| **Shaoni** | Board should default to CBSE but be extensible | Board field is locked to CBSE with visual indicator; architecture supports future expansion |
| **Harshada** | Country/state needed for regional curriculum alignment | Country dropdown with conditional State selector (shows Indian states when India selected) |
| **General** | Subject selection drives chapter list | Subject dropdown populates chapter options in S3 dynamically |

### Design Decisions
- All fields required for proper assessment personalization
- CBSE locked but displayed (not hidden) for transparency
- State field appears conditionally to reduce form complexity for non-Indian users

---

## S2 — Assessment Type Selection Screen

### Feedback Incorporated

| Stakeholder | Feedback | How It's Addressed |
|-------------|----------|-------------------|
| **Shreya** | Users don't understand difference between Quick, Practice, and Chapter-wise | Each type card has an **(i) info icon** with tooltip explaining: typical duration, question count, and content scope |
| **Nishant** | Need to explain what each type means without overwhelming the user | Tooltips are progressive disclosure—main label is clean, details on hover/tap |
| **Rahee** | Quick should be truly quick—minimal config | Quick type auto-defaults most settings; user goes straight to generation |
| **Sravana** | Practice vs Chapter-wise difference is unclear | Tooltip clarifies: Chapter-wise = focused on 1–5 chapters; Practice = full syllabus/broad coverage |

### Design Decisions
- Large touch-friendly cards (not small radio buttons)
- Tooltip content:
  - **Chapter-wise:** "Test yourself on 1–5 specific chapters you choose. ~15–30 min."
  - **Practice:** "Comprehensive practice across the full syllabus. ~30–45 min."
  - **Quick:** "10-minute quick refresh. System picks questions for you."

---

## S3 — Configure Assessment Screen

### Feedback Incorporated

| Stakeholder | Feedback | How It's Addressed |
|-------------|----------|-------------------|
| **Nishant** | Question count should be in increments of 5 | Dropdown/stepper offers: 5, 10, 15, 20, 25, 30 |
| **Shreya** | Difficulty naming is confusing (Bloom's vs language vs Easy/Medium/Hard) | UI uses simple student-facing labels: **Easy / Medium / Hard**. Bloom's mapping happens backend-side |
| **Shaoni** | Chapter selection must enforce 1–5 limit for Chapter-wise type | Multi-select component shows selected count and blocks selection beyond 5 with error message |
| **Harshada** | "Manual" naming is confusing—rename to "Print" | Format toggle uses labels: **Digital** vs **Print** |
| **Sravana** | Print option should clarify it includes upload for grading | Print toggle shows subtitle: "PDF download + upload for grading" |
| **Rahee** | For Quick type, minimize configuration | Quick type pre-selects defaults; user only sees Generate button (chapters/difficulty auto-selected) |

### Design Decisions
- Chapter-wise: shows full multi-select with 1–5 enforcement
- Practice: shows multi-select with "All" option
- Quick: hides chapter selector entirely; uses smart defaults
- Format toggle is prominent (not hidden in advanced settings)
- Generate button is disabled until required fields are complete

---

## S4 — Digital Assessment Taking Screen

### Feedback Incorporated

| Stakeholder | Feedback | How It's Addressed |
|-------------|----------|-------------------|
| **Shreya** | Showing all questions at once is overwhelming | **1 question per screen** with progress bar (e.g., "Question 3 of 20") |
| **Nishant** | Need to support multiple question types | Renderer supports: MCQ (radio), Fill-in-blank (text input), Short answer (textarea), Long answer (larger textarea) |
| **Sravana** | Users should be able to navigate back to review | Previous/Next navigation buttons; users can jump back before final submit |
| **Shaoni** | Progress should be visible | Fixed progress bar at top showing completion percentage |
| **Rahee** | Submit should require confirmation | Submit button shows only on last question; confirmation dialog before final submission |
| **General (English subject)** | Need to support passage-based questions | Question renderer extensible for grouped questions (passage + sub-items) |

### Design Decisions
- Single question focus reduces cognitive load
- Answers are saved in state as user progresses (can resume if interrupted)
- MCQ: radio buttons with A/B/C/D labels
- FIB: inline text input
- Short/Long: textarea with appropriate height

---

## S5 — Print Download Screen

### Feedback Incorporated

| Stakeholder | Feedback | How It's Addressed |
|-------------|----------|-------------------|
| **Harshada** | "Manual mode" naming is unclear | Screen titled "Download & Print" with clear Print workflow language |
| **Sravana** | Users need both question paper AND answer sheet | Two separate download buttons: "Download Question Paper (PDF)" and "Download Answer Sheet Template" |
| **Rahee** | Answer sheet should be OCR-friendly | Answer template is designed for clean handwriting capture with clear boxes/lines |
| **Nishant** | Instructions should guide the print workflow | Instructions panel explains: 1) Print both documents, 2) Write answers on template, 3) Scan/photo and upload |
| **General** | MCQ marking approach needs clarity | Answer sheet uses A/B/C/D letter boxes (decision: letters over bubbles for handwriting recognition) |

### Design Decisions
- Two distinct download buttons (not combined)
- Clear step-by-step instructions visible on screen
- "Continue to Upload" button for seamless flow
- Option to "Take Assessment Digitally Instead" for users who change their mind

---

## S6 — Upload Answer Sheet Screen

### Feedback Incorporated

| Stakeholder | Feedback | How It's Addressed |
|-------------|----------|-------------------|
| **Sravana** | Upload UX should support "take a photo" option | Upload area accepts camera input on mobile; text says "Tap to take photo or upload file" |
| **Nishant** | Need clear photo capture instructions | Instructions panel with tips: good lighting, flat surface, all pages visible, avoid shadows |
| **Rahee** | Must support multi-page uploads (front/back) | Multi-file upload supported; file list shows all uploaded files with remove option |
| **Shaoni** | File format support should be clear | Accepted formats listed: PDF, JPEG, PNG (up to 10MB per file) |
| **Harshada** | Progress/status should be visible during upload | Upload progress indicator; file list shows upload status per file |
| **General** | What if upload fails or file is unreadable? | Error states with clear retry messaging; validation before submission |

### Design Decisions
- Drag-and-drop zone + click to select + camera capture
- Visual file list with thumbnails where possible
- Clear file limits displayed (max 10 files, 10MB each)
- Submit button disabled until at least one file uploaded

---

## S7 — Feedback Report Screen

### Feedback Incorporated

| Stakeholder | Feedback | How It's Addressed |
|-------------|----------|-------------------|
| **Nishant** | Report must show per-question correctness | Question-by-question breakdown with ✓/✗ indicators |
| **Shreya** | Feedback should be actionable, not just scores | "What to do next" section with 1–2 paragraphs of specific improvement suggestions |
| **Sravana** | Grading should follow CBSE alignment | Scoring uses CBSE-inspired rubric: Content (understanding), Expression (clarity), Accuracy (correctness) |
| **Shaoni** | Avoid strict "value point" matching | Rubric-based grading allows partial credit; doesn't require exact phrase matching |
| **Rahee** | Need clear next actions after viewing report | Three action buttons: "Retake Assessment", "New Assessment", "Exit" |
| **Harshada** | Retake meaning needs clarity | Retake = same questions again (for now); label is explicit |
| **General** | Score should be prominent | Large score display at top (e.g., "15/20 — 75%") with visual indicator (color-coded) |

### Design Decisions
- Score summary with percentage and visual progress ring
- Collapsible question-by-question section (expandable for details)
- Feedback section uses friendly, encouraging tone
- Action buttons are prominent at bottom
- Future: "View Solutions" option (not MVP)

---

## Summary: Key Stakeholder Themes Addressed

| Theme | Stakeholders | Screens Affected |
|-------|--------------|------------------|
| **Terminology clarity** (Manual→Print, difficulty naming) | Harshada, Shreya | S3, S5 |
| **Assessment type explanations** | Shreya, Nishant, Sravana | S2 |
| **Pre-generation student info** | Nishant | S1 |
| **Print workflow as first-class** | Rahee, Sravana | S0, S5, S6 |
| **Question count increments of 5** | Nishant | S3 |
| **1 question per screen** | Shreya | S4 |
| **Upload UX with photo capture** | Sravana, Nishant | S6 |
| **CBSE-aligned grading** | Sravana, Shaoni | S7 |
| **Actionable feedback** | Shreya, Nishant | S7 |
| **Clear next actions** | Rahee, Harshada | S7 |

---

## Feedback Still Pending Product Decision

These items were raised but require product decisions before implementation:

| Item | Raised By | Status |
|------|-----------|--------|
| Retake meaning (same paper vs incorrect-only vs new set) | Rahee | Default to "same questions"; pending final decision |
| Post-generation question shuffle/remove | Nishant | Not in MVP; architecture supports future addition |
| Assessment history/account for upload matching | Sravana | Not in MVP; enforce immediate upload after print |
| Bloom's taxonomy controls in UI | Shaoni | Hidden for students; possible teacher-facing feature later |
| Voice-to-text for digital answers | General | Icon placeholder; disabled in MVP |
