# ATM Web App - Meeting Summary
**Date:** December 19, 2025  
**Attendees:** Harshit, Karishma, Harshada, Shreya, Shaoni, Sravana

---

## 🔗 Live Prototype

**URL:** https://atm-lx7h-mupsr6chj-harshits-projects-48d6a967.vercel.app/

*(Works on desktop and mobile - displays as mobile app view)*

---

## Key Decisions

- **User persona:** Single user, B2C, student-facing (no multi-profile needed for MVP)
- Working UI prototype built using GitHub Copilot + Claude Opus 4.5 (~3-4 hours)
- Stakeholder feedback from earlier document incorporated
- First iteration to move to development next week

---

## What's in the Prototype

### Core Flows
| Flow | What You Can Do |
|------|-----------------|
| **Home Screen** | See profile, choose between Create Assessment, Upload, or Learning Journey |
| **Create Assessment** | Pick subject → Choose type (Chapter/Practice/Quick) → Select chapters → Set difficulty → Take test |
| **Take Assessment** | Answer MCQs, use voice input for text answers, see progress |
| **View Results** | See score breakdown, correct answers, feedback per question |
| **Upload Answer Sheet** | Select assessment → Take photo/scan/upload file → Submit for grading |
| **Learning Journey** | View history of all assessments with scores and dates |

### UI Features Included
- Mobile-first responsive design
- Voice input for answers (UI ready)
- Camera/scan/file upload options
- Progress tracking during tests
- Score visualization with animated ring
- Question-level feedback display
- Demo data pre-populated for testing

---

## Action Items

| Owner | Task | Timeline |
|-------|------|----------|
| ✅ Harshit | Host prototype on Vercel and share URL | Done |
| All Stakeholders | Review prototype, add feedback to shared Google Doc (screenshots + comments) | By Monday |
| Harshit + Karishma | Finalize UI changes based on feedback | Mon/Tue |
| Harshit | Hand over to Harshada for production development | Next week |
| Karishma, Harshit, Shravana, Rakesh | Backend AI pipeline discussion | Before Dec 25 |
| Shreya, Shaoni, Rahi, Suchra | Content discussion (quick tests, pre-tests, topic selection logic) | Separate call TBD |

**Note:** Harshit unavailable Dec 25-31

---

## How to Review

1. **Open the link** on your phone or desktop
2. **Click through** the different flows
3. **Take screenshots** of anything you want changed
4. **Add notes** explaining what you'd like different
5. **Share in Google Doc** or send directly to Karishma/Harshit

**Tips:**
- Data entered is saved in your browser only (clears when you close)
- If something looks broken, refresh the page
- Best viewed on mobile or in desktop mobile view

---

## Project Status

| Aspect | Status |
|--------|--------|
| Phase | UI Prototype Complete ✅ |
| Tech Stack | Vanilla JS, CSS (mobile-first), no backend yet |
| Dev Approach | AI-assisted (GitHub Copilot) - reduces dev time 30-40% |
| Next Phase | Backend integration + production deployment |

---

## Pending Decisions (Need Content Team Input)

- What topics should Quick Tests cover?
- Should we have pre-defined tests or all custom?
- How should difficulty levels work?
- What feedback should be shown per question?

---

## Notes

- Content decisions (quick tests, pre-tests, topic selection) require separate discussion with content team
- Backend logic (difficulty, question count) to be defined server-side
- UI iterations can be done quickly (~2-3 min per screen) using AI tools
- Harshada to review code quality before production
