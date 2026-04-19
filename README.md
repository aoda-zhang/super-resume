# Super Resume

> A resume builder designed for job seekers targeting Germany and the DACH region. Built with German HR expectations in mind — two-column layouts, photo support, A4 PDF export, and full German language support.

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-6-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-brightgreen)

[中文文档](./README_CN.md)

---

## 🎯 Why This Project

When applying for jobs in Germany, a resume that matches local expectations makes a big difference:

- 📄 **German-standard layouts** — Two-column timeline design, sidebar with personal info — the format German recruiters know and expect
- 🖼️ **Photo support** — German CVs typically include a professional photo; upload and crop with one click
- 🇩🇪 **German language** — Built-in German labels and field names; generate a full German Lebenslauf
- 📐 **A4 format** — European standard paper size; exported PDFs are print-ready
- 🌍 **Trilingual** — Chinese / English / German — write once, generate all three versions

---

## ✨ Features

| | |
|---|---|
| 🎨 **Live Editor** | Split-pane layout: edit on the left, preview on the right |
| 🔀 **Drag & Drop** | Reorder sections by dragging in the sidebar |
| 📤 **One-click PDF** | Clean print styles, A4-ready export |
| 💾 **JSON Import/Export** | Backup your data or migrate easily |
| 🌍 **Multi-language** | Interface in Chinese / English / German; field labels auto-adapt |
| 📝 **Trilingual Content** | Write your content once, switch languages to generate different versions |

---

## 🎯 Templates

### Single Column
Classic vertical layout: name, title, contact at the top, followed by experience and education in chronological order. Works well for most applications.

### Two Column
Left sidebar with photo, personal info, and skills; right main area with timeline-based work experience. **This is the layout German HRs are most familiar with** — commonly used in Europass and German job portals.

---

## 🚀 Quick Start

### Install & Run

```bash
git clone https://github.com/aoda-zhang/super-resume.git
cd super-resume
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to start editing.

### Build for Production

```bash
npm run build
npm run preview
```

### Use Online

```
https://aoda-zhang.github.io/super-resume/
```

---

## 📁 Project Structure

```
src/
├── components/
│   ├── Editor/              # Main editor (split-pane)
│   │   ├── ResumeWorkspace.tsx
│   │   ├── SectionEditor.tsx
│   │   └── MarkdownEditor.tsx
│   ├── Sections/            # Sidebar editing panels
│   │   ├── SummarySection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── EducationSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── LanguagesSection.tsx
│   │   └── InterestsSection.tsx
│   └── Templates/           # Resume rendering
│       ├── SingleColumnTemplate/
│       ├── shared/
│       │   ├── SectionRenderers.tsx
│       │   ├── templateStyles.ts
│       │   └── useTemplateData.ts
│       └── EditableComponents.tsx
├── store/
│   └── resumeStore.ts       # Zustand state
├── types/
│   └── resume.ts            # TypeScript types
├── i18n/
│   └── locales/             # zh.json · en.json · de.json
└── utils/
    └── exportPdf.ts         # PDF export (window.print)
```

---

## 🛠 Tech Stack

| | |
|---|---|
| React 19 | UI framework |
| TypeScript 6 | Type safety |
| Vite 5 | Build tool |
| Tailwind CSS 4 | Styling |
| Zustand 5 | State management |
| dnd-kit | Drag and drop |

---

## 📋 Data Format

Resume data is stored as JSON, supporting import/export for backup:

```typescript
interface ResumeData {
  personalInfo: {
    fullName: string;
    title?: string;
    email: string;
    phone: string;
    address: string;
    linkedin?: string;
    website?: string;
    github?: string;
    photo?: string;
    nationality?: string;
  };
  summary: string;
  interests: string;
  experience: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description: string;
    address?: string;
    techStack?: string;
    country?: string;
    workMode?: string;
  }>;
  education: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate?: string;
    current: boolean;
  }>;
  skills: Array<{ id: string; name: string }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    technologies: string[];
  }>;
  languages: Array<{
    id: string;
    name: string;
    level: string;
  }>;
}
```

---

## 📜 License

MIT
