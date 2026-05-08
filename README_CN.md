# Simple Power Resume · 简单强力简历生成器

> 简单却强大的开源简历生成器。支持实时编辑、拖拽排序、多语言、一键导出 PDF，帮你快速制作专业简历。

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-6-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![GitHub Pages](https://img.shields.io/badge/部署-GitHub%20Pages-brightgreen)

[English](./README.md)

---

## 📖 关于项目

Simple Power Resume 是一个简洁直观的开源简历生成器,面向所有专业人士。无论你是开发者、设计师还是其他领域从业者,它都能帮你零门槛制作专业、适配 A4 纸格式的简历。

设计初衷是简单与强大并存,核心功能包括：

- **所见即所得分栏编辑器** — 左编辑右预览,实时反馈
- **拖拽排序** — 轻松调整简历各模块顺序
- **一键导出 PDF** — 干净、可直接打印的 A4 PDF,秒级生成
- **多语言支持** — 界面支持中英德三语,一份内容生成多语言简历
- **JSON 导入导出** — 轻松备份或迁移简历数据

项目免费开源,采用 MIT 协议。适合所有想要专业简历却不想花时间学习复杂工具的人！🚀

---

## 🎯 为什么选择 Simple Power Resume

一份优秀的简历能极大提升求职成功率。Simple Power Resume 的优势在于：

- 📄 **专业模板** — 简洁现代的布局,符合招聘方偏好,默认 A4 格式
- 🖼️ **照片支持** — 可选专业证件照上传,内置裁剪工具
- 🌍 **多语言** — 内置中英德字段标签,一份数据生成多语言简历
- 📐 **A4 标准** — 国际通用纸张尺寸,避免格式错乱
- ✏️ **实时编辑** — 分栏预览,改动即时可见
- 💾 **数据便携** — 基于 JSON 存储,轻松备份迁移

---

## ✨ 功能特点

| | |
|---|---|
| 🎨 **所见即所得编辑器** | 左边编辑、右边实时预览,每一步改动即时反映 |
| 🔀 **拖拽排序** | 用鼠标拖动调整各模块顺序 |
| 📤 **一键导出 PDF** | 打印样式优化,导出一张干净的 A4 PDF |
| 💾 **JSON 导入 / 导出** | 数据以 JSON 存储,方便备份或迁移 |
| 🌍 **三语言支持** | 中文 / English / Deutsch 切换,字段标签自动适配 |
| 📝 **中英德三语简历内容** | 一份基础内容,生成三个语言版本 |

---

## 🚀 快速开始

### 安装

```bash
git clone https://github.com/aoda-zhang/simple-power-resume.git
cd simple-power-resume
npm install
npm run dev
```

打开 [http://localhost:5173](http://localhost:5173),开始编辑简历。

### 构建生产版本

```bash
npm run build
npm run preview
```

### 在线使用

```
https://aoda-zhang.github.io/simple-power-resume/
```

---

## 📁 项目结构

```
src/
├── components/
│   ├── Editor/              # 编辑器主体(左右分栏)
│   │   ├── ResumeWorkspace.tsx
│   │   ├── SectionEditor.tsx
│   │   └── MarkdownEditor.tsx
│   ├── Sections/            # 左侧编辑面板各模块
│   │   ├── SummarySection.tsx
│   │   ├── ExperienceSection.tsx
│   │   ├── EducationSection.tsx
│   │   ├── SkillsSection.tsx
│   │   ├── ProjectsSection.tsx
│   │   ├── LanguagesSection.tsx
│   │   └── InterestsSection.tsx
│   └── Templates/           # 简历模板渲染
│       ├── SingleColumnTemplate/
│       ├── shared/
│       │   ├── SectionRenderers.tsx  # 各条目渲染组件
│       │   ├── templateStyles.ts      # 共享样式常量
│       │   └── useTemplateData.ts    # i18n 数据 hook
│       └── EditableComponents.tsx
├── store/
│   └── resumeStore.ts       # Zustand 全局状态
├── types/
│   └── resume.ts            # TypeScript 类型定义
├── i18n/
│   └── locales/             # zh.json · en.json · de.json
└── utils/
    └── exportPdf.ts         # PDF 导出(window.print)
```

---

## 🛠 技术栈

| | |
|---|---|
| React 19 | UI 框架 |
| TypeScript 6 | 类型安全 |
| Vite 5 | 构建工具 |
| Tailwind CSS 4 | 样式 |
| Zustand 5 | 状态管理 |
| dnd-kit | 拖拽排序 |

---

## 📋 数据格式

简历数据统一存储为 JSON,支持导入 / 导出备份:

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
