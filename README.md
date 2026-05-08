# Simple Power Resume

> A simple yet powerful open-source resume builder. Create professional, A4-ready resumes with live editing, drag-and-drop, multi-language support, and one-click PDF export.

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-6-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![GitHub Pages](https://img.shields.io/badge/Deploy-GitHub%20Pages-brightgreen)

[中文文档](./README_CN.md)

---

## 📖 About

Simple Power Resume is a clean, intuitive open-source resume builder designed for everyone. Whether you're a developer, designer, or any professional, it helps you create professional, A4-ready resumes with zero hassle.

Built with simplicity and power in mind, it comes with:

- **Live split-pane editor** — edit on the left, preview on the right in real time
- **Drag-and-drop sorting** — rearrange resume sections effortlessly
- **One-click PDF export** — clean, print-ready A4 PDFs in seconds
- **Multi-language support** — interface in Chinese, English, German; write once, generate multiple versions
- **JSON import/export** — backup or migrate your resume data easily

This project is free, open-source, and MIT licensed. Perfect for anyone who wants a professional resume without the learning curve! 🚀

---

## 🎯 Why Simple Power Resume

A great resume makes a huge difference in your job search. Simple Power Resume stands out because:

- 📄 **Professional templates** — Clean, modern layouts that recruiters love, A4 format by default
- 🖼️ **Photo support** — Optional professional photo upload with crop tool
- 🌍 **Multi-language** — Built-in Chinese, English, German labels; generate resumes in multiple languages from one dataset
- 📐 **A4 standard** — European/International standard paper size, no more formatting issues
- ✏️ **Live editing** — See changes instantly with split-pane preview
- 💾 **Data portability** — JSON-based storage for easy backup and migration

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

## 🚀 Quick Start

### Install & Run

```bash
git clone https://github.com/aoda-zhang/simple-power-resume.git
cd simple-power-resume
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
https://aoda-zhang.github.io/simple-power-resume/
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
