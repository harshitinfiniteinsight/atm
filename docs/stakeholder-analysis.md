# ATM - Stakeholder Analysis & Requirements Review

## Document Version
- **Date:** December 19, 2025
- **Status:** Review Required
- **Last Updated By:** Development Team

---

## 1. Key Stakeholders

### Primary Users
| Stakeholder | Role | Key Needs | Status |
|-------------|------|-----------|--------|
| **Students/Learners** | Primary users taking assessments | Easy profile switching, personalized experience, track progress | 🔄 In Progress |
| **Parents** | May manage multiple children's profiles | View all children's progress, easy profile management | ⚠️ Needs Review |
| **Teachers** | May use for classroom assessments | Quick profile setup, batch assessments | ⚠️ Needs Review |

### Secondary Stakeholders
| Stakeholder | Role | Key Needs | Status |
|-------------|------|-----------|--------|
| **School Administrators** | Deployment & oversight | Usage analytics, compliance | ❌ Not Addressed |
| **Pratham Education Team** | Product owners | Curriculum alignment, learning outcomes | ⚠️ Needs Review |
| **Content Team** | Assessment content | Question quality, difficulty calibration | ⚠️ Needs Review |

---

## 2. Critical Requirement Gaps Identified

### Multi-Profile Support (HIGH PRIORITY)
**Current State:** Single user per device
**Required State:** Multiple learner profiles per device

| Feature | Description | Priority | Status |
|---------|-------------|----------|--------|
| Profile Switcher | Select active learner before assessment | P0 | ❌ Missing |
| Add New Profile | Create additional learner profiles | P0 | ❌ Missing |
| Profile-Specific History | Each learner sees only their assessments | P0 | ❌ Missing |
| Learning Journey | Individual progress tracking per learner | P1 | ❌ Missing |
| Profile Avatar/Colors | Visual differentiation between profiles | P2 | ❌ Missing |
| Profile PIN (Optional) | Privacy for individual learners | P3 | ❌ Missing |

### UI/UX Feedback Gaps
| Item | Feedback | Priority | Status |
|------|----------|----------|--------|
| Info Icons (?) | Tooltips not visible on mobile tap | P2 | ⚠️ Needs Fix |
| Button Affordance | Some buttons don't look clickable | P2 | ✅ Fixed |
| Scroll Indicators | Users don't know content continues | P2 | ⚠️ Needs Review |
| Loading States | No feedback during generation | P1 | ⚠️ Needs Review |
| Error Messages | Generic errors not helpful | P2 | ⚠️ Needs Review |

### Accessibility Gaps
| Item | Issue | Priority | Status |
|------|-------|----------|--------|
| Screen Reader | ARIA labels missing | P2 | ❌ Missing |
| Color Contrast | Some text may not meet WCAG | P2 | ⚠️ Needs Review |
| Touch Targets | Some buttons too small | P2 | ⚠️ Needs Review |
| Font Scaling | May break with system font size | P3 | ⚠️ Needs Review |

---

## 3. Multi-Profile Architecture

### Data Model
```
localStorage Structure:
├── atm_profiles: [
│   {
│     id: "uuid",
│     name: "Aarav",
│     avatar: "blue",
│     grade: 8,
│     school: "DPS",
│     createdAt: "...",
│     lastActiveAt: "..."
│   },
│   {
│     id: "uuid",
│     name: "Priya",
│     avatar: "pink",
│     grade: 6,
│     ...
│   }
│ ]
├── atm_active_profile: "uuid"
├── atm_history_<profile_id>: [...]
├── atm_settings_<profile_id>: {...}
```

### User Flow (Updated)
```
App Launch
    │
    ▼
┌─────────────────────┐
│   Profile Select    │ ◄── Who's learning today?
│   [Aarav] [Priya]   │
│   [+ Add Learner]   │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│   Home (S0)         │ ◄── Shows active profile name
│   "Hi, Aarav!"      │
│   [Create] [Upload] │
└─────────────────────┘
    │
    ▼
┌─────────────────────┐
│   Assessment Flow   │
│   S2 → S3 → S4...   │
└─────────────────────┘
```

---

## 4. Action Items

### Immediate (Sprint 1)
- [ ] Implement multi-profile data model
- [ ] Create Profile Selector screen
- [ ] Create Add Profile flow
- [ ] Update history to be profile-specific
- [ ] Update header to show active profile

### Short-term (Sprint 2)
- [ ] Profile avatars/colors
- [ ] Learning journey dashboard
- [ ] Fix info icon tooltips for mobile
- [ ] Add loading states

### Medium-term (Sprint 3)
- [ ] Profile PIN/privacy
- [ ] Export profile data
- [ ] Accessibility audit
- [ ] Performance optimization

---

## 5. Questions for Stakeholders

1. **Maximum profiles per device?** (Suggested: 5-6)
2. **Should parents have a "parent view" to see all children?**
3. **Is profile deletion needed? With what confirmation?**
4. **Should profiles sync across devices?** (Requires backend)
5. **Age-appropriate UI themes per grade level?**
6. **Offline-first requirements?**

---

## 6. Sign-off Required

| Stakeholder | Name | Approved | Date |
|-------------|------|----------|------|
| Product Owner | | ☐ | |
| Tech Lead | | ☐ | |
| UX Designer | | ☐ | |
| QA Lead | | ☐ | |

---

*This document should be reviewed and updated after stakeholder meetings.*
