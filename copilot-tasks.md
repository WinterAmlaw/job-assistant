# Job Assistant App — Copilot Task File

## 🧱 SETUP

TASK: ~~Initialize a new Next.js 14 project using the App Router, Tailwind CSS, and ShadCN UI. Configure dark mode and install icons.~~ ✅ DONE

TASK: Create a navigation layout with three routes: /jobs, /resumes, and /tools. Use ShadCN's Navbar component and responsive layout.

---

## 📋 JOB TRACKER MODULE

TASK: Create a Job Tracker UI where users can add, edit, and delete job applications.
Each job should include:
- Company name
- Position title
- Status (dropdown: Applied, Interviewing, Rejected, Offer)
- Date applied
- Notes
- Tasks (e.g., follow-up reminders)

TASK: Store job tracker state in a local `useState` + LocalStorage combo. Add a "Save to JSON" and "Import from JSON" button to download/upload state.

TASK: Add filtering and sorting for job status and date applied using ShadCN select components.

---

## 📄 RESUME KEYWORD ANALYZER

TASK: Create a Resume Keyword Analyzer tool.
User can:
- Paste a job description into one box
- Paste or upload resume text into another
- Output a match percentage based on keyword overlap
- Highlight unique/missing keywords

Use `lib/keywordMatcher.ts` to extract, compare, and score keywords.

---

## 🌐 JOB LISTING SCRAPER (CLIENT + NODE)

TASK: Add a "Scrape Jobs" tool under /tools. Use `fetch()` to get jobs from the GitHub Jobs API or RemoteOK and render them in a card layout.

TASK: Build a Node.js script using `cheerio` or `puppeteer` that scrapes jobs from Indeed based on a CLI query and saves results to `scraped-jobs.json`.

---

## ✅ TASK LIST

TASK: For each job entry, allow the user to add tasks (e.g., "Follow up", "Send test project"). Display tasks with due dates, checkbox, and completion status.

---

## 💾 STORAGE UTILS

TASK: Create `lib/storage.ts` with helper functions:
- saveToFile(data: any, filename: string)
- readFromFile(input: File): Promise<any>
- autosaveToLocalStorage(key: string, data: any)

TASK: When user loads a new JSON, show a modal confirmation using ShadCN's AlertDialog.

---

## 📊 DASHBOARD

TASK: On the home page, show:
- Total number of applications
- # of jobs per status
- Last applied job
- Tasks due this week

Use ShadCN Cards and `date-fns` for date handling.

---

## 🔧 OPTIONAL: MAKE THIS A PWA

TASK: Add service worker and manifest.json so this app can run offline. Use `next-pwa` to enable full local usage.
