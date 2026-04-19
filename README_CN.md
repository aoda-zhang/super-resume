# 超级简历 · Super Resume

> 专为在德国及德语区找工作设计的简历生成器。内置德国 HR 最熟悉的专业模板，支持中 / 英 / 德三语，一键导出 A4 PDF。

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-6-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![GitHub Pages](https://img.shields.io/badge/部署-GitHub%20Pages-brightgreen)

[English](./README.md)

---

## 🎯 解决什么问题

申请德国工作时，一份符合当地习惯的简历至关重要：

- 📄 **德国 HR 熟悉的版式** — 两栏时间线、左侧边栏个人信息，符合 Europass 及德企简历惯例
- 🖼️ **证件照支持** — 德国简历通常附照片，一键上传裁剪
- 🇩🇪 **德语简历** — 内置德语字段标签，标题、内容、联系方式全德文
- 📐 **A4 尺寸** — 欧洲标准纸张，导出 PDF 自动适配，不变形
- 🌍 **中英德三语** — 用中文写好内容，切换语言即可生成对应版本

---

## ✨ 功能特点

| | |
|---|---|
| 🎨 **所见即所得编辑器** | 左边编辑、右边实时预览，每一步改动即时反映 |
| 🔀 **拖拽排序** | 用鼠标拖动调整各模块顺序 |
| 📤 **一键导出 PDF** | 打印样式优化，导出一张干净的 A4 PDF |
| 💾 **JSON 导入 / 导出** | 数据以 JSON 存储，方便备份或迁移 |
| 🌍 **三语言支持** | 中文 / English / Deutsch 切换，字段标签自动适配 |
| 📝 **中英德三语简历内容** | 一份基础内容，生成三个语言版本 |

---

## 🎯 模板

### Single Column · 单栏式
经典上下布局：顶部放姓名、职位、联系方式，下方按时间顺序排列工作经历、教育背景等。适合大多数职位申请。

### Two Column · 双栏式
左侧边栏含照片、个人信息、技能标签；右侧主区域以时间线展示工作经历。**这是德国 HR 最熟悉的 CV 格式**，Europass 及德企招聘网站常用此布局。

---

## 🚀 快速开始

### 安装

```bash
git clone https://github.com/aoda-zhang/super-resume.git
cd super-resume
npm install
npm run dev
```

打开 [http://localhost:5173](http://localhost:5173)，开始编辑简历。

### 构建生产版本

```bash
npm run build
npm run preview
```

### 在线使用

```
https://aoda-zhang.github.io/super-resume/
```

---

## 📁 项目结构

```
src/
├── components/
│   ├── Editor/              # 编辑器主体（左右分栏）
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
    └── exportPdf.ts         # PDF 导出（window.print）
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

简历数据统一存储为 JSON，支持导入 / 导出备份：

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
