import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ResumeData, TemplateType } from '../types/resume';
import { resumeToMarkdown, markdownToResume } from '../utils/markdown';

export type EditorMode = 'markdown' | 'visual';

export type Language = 'zh' | 'en' | 'de';

interface SectionOrder {
  id: string;
  type: 'personal' | 'summary' | 'experience' | 'education' | 'projects' | 'skills' | 'languages';
  label: string;
  visible: boolean;
}

const zhSample: ResumeData = {
  personalInfo: {
    fullName: '张明',
    email: 'zhangming@example.com',
    phone: '138-0000-0000',
    location: '北京市',
    linkedin: '',
    website: '',
    summary: '5年全栈开发经验，专注于React和Node.js技术栈。热爱开源，积极参与技术社区。',
  },
  experience: [
    {
      id: '1',
      company: '科技有限公司',
      position: '高级前端工程师',
      startDate: '2022-01',
      endDate: '',
      current: true,
      description: '负责公司核心产品的前端架构设计和开发\n带领5人团队完成多个重要项目\n优化前端性能，首屏加载时间减少50%',
    },
    {
      id: '2',
      company: '互联网公司',
      position: '前端工程师',
      startDate: '2020-06',
      endDate: '2021-12',
      current: false,
      description: '参与电商平台的前端开发\n实现复杂的交互功能和动画效果\n与设计师紧密合作，确保UI/UX质量',
    },
  ],
  education: [
    {
      id: '1',
      school: '北京大学',
      degree: '本科',
      field: '计算机科学与技术',
      startDate: '2016-09',
      endDate: '2020-06',
      current: false,
    },
  ],
  skills: [
    { id: '1', name: 'React', level: 'expert' },
    { id: '2', name: 'TypeScript', level: 'expert' },
    { id: '3', name: 'Node.js', level: 'advanced' },
    { id: '4', name: 'Python', level: 'intermediate' },
  ],
  projects: [
    {
      id: '1',
      name: '开源组件库',
      description: '基于React的UI组件库，提供50+高质量组件，GitHub Stars 2k+',
      link: 'https://github.com/example/ui-lib',
      technologies: ['React', 'TypeScript', 'Rollup'],
    },
  ],
  languages: [
    { id: '1', name: '中文', level: '母语' },
    { id: '2', name: '英语', level: '流利' },
  ],
};

const enSample: ResumeData = {
  personalInfo: {
    fullName: 'John Smith',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    location: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johnsmith',
    website: 'johnsmith.dev',
    summary: '5+ years of full-stack development experience, specializing in React and Node.js ecosystems. Passionate about open source and active in the developer community.',
  },
  experience: [
    {
      id: '1',
      company: 'Tech Corp',
      position: 'Senior Frontend Engineer',
      startDate: '2022-01',
      endDate: '',
      current: true,
      description: 'Led frontend architecture design for core products\nManaged a team of 5 engineers on critical projects\nOptimized frontend performance, reducing FCP by 50%',
    },
    {
      id: '2',
      company: 'StartupXYZ',
      position: 'Frontend Engineer',
      startDate: '2020-06',
      endDate: '2021-12',
      current: false,
      description: 'Built e-commerce platform frontend\nImplemented complex interactive features and animations\nCollaborated with designers to ensure UI/UX quality',
    },
  ],
  education: [
    {
      id: '1',
      school: 'MIT',
      degree: "Bachelor's",
      field: 'Computer Science',
      startDate: '2016-09',
      endDate: '2020-06',
      current: false,
    },
  ],
  skills: [
    { id: '1', name: 'React', level: 'expert' },
    { id: '2', name: 'TypeScript', level: 'expert' },
    { id: '3', name: 'Node.js', level: 'advanced' },
    { id: '4', name: 'Python', level: 'intermediate' },
  ],
  projects: [
    {
      id: '1',
      name: 'Open Source UI Library',
      description: 'React-based UI component library with 50+ high-quality components, 2k+ GitHub Stars',
      link: 'https://github.com/example/ui-lib',
      technologies: ['React', 'TypeScript', 'Rollup'],
    },
  ],
  languages: [
    { id: '1', name: 'English', level: 'Native' },
    { id: '2', name: 'Chinese', level: 'Fluent' },
    { id: '3', name: 'German', level: 'Basic' },
  ],
};

const deSample: ResumeData = {
  personalInfo: {
    fullName: 'Max Müller',
    email: 'max.mueller@example.de',
    phone: '+49 170 1234567',
    location: 'Berlin, Deutschland',
    linkedin: 'linkedin.com/in/maxmueller',
    website: 'maxmueller.de',
    summary: 'Erfahrener Full-Stack-Entwickler mit 5+ Jahren Erfahrung, spezialisiert auf React und Node.js. Leidenschaftlich für Open Source und aktive Teilnahme an der Entwickler-Community.',
  },
  experience: [
    {
      id: '1',
      company: 'Tech GmbH',
      position: 'Senior Frontend-Entwickler',
      startDate: '2022-01',
      endDate: '',
      current: true,
      description: 'Verantwortlich für die Frontend-Architektur und Entwicklung\nLeitung eines 5-köpfigen Teams für wichtige Projekte\nOptimierung der Frontend-Performance, FCP um 50% reduziert',
    },
    {
      id: '2',
      company: 'Digital AG',
      position: 'Frontend-Entwickler',
      startDate: '2020-06',
      endDate: '2021-12',
      current: false,
      description: 'Mitwirkung an der E-Commerce-Plattform-Entwicklung\nImplementierung komplexer interaktiver Features\nEnge Zusammenarbeit mit Designern für beste UI/UX-Qualität',
    },
  ],
  education: [
    {
      id: '1',
      school: 'TU Berlin',
      degree: 'Bachelor',
      field: 'Informatik',
      startDate: '2016-09',
      endDate: '2020-06',
      current: false,
    },
  ],
  skills: [
    { id: '1', name: 'React', level: 'expert' },
    { id: '2', name: 'TypeScript', level: 'expert' },
    { id: '3', name: 'Node.js', level: 'advanced' },
    { id: '4', name: 'Python', level: 'intermediate' },
  ],
  projects: [
    {
      id: '1',
      name: 'Open-Source-UI-Bibliothek',
      description: 'React-basierte UI-Komponentenbibliothek mit über 50 hochwertigen Komponenten, 2k+ GitHub Stars',
      link: 'https://github.com/example/ui-lib',
      technologies: ['React', 'TypeScript', 'Rollup'],
    },
  ],
  languages: [
    { id: '1', name: 'Deutsch', level: 'Muttersprache' },
    { id: '2', name: 'Englisch', level: 'Fließend' },
    { id: '3', name: 'Chinesisch', level: 'Grundkenntnisse' },
  ],
};

const defaultSectionOrder: SectionOrder[] = [
  { id: 'personal', type: 'personal', label: '个人信息', visible: true },
  { id: 'summary', type: 'summary', label: '个人简介', visible: true },
  { id: 'experience', type: 'experience', label: '工作经验', visible: true },
  { id: 'education', type: 'education', label: '教育背景', visible: true },
  { id: 'projects', type: 'projects', label: '项目经历', visible: true },
  { id: 'skills', type: 'skills', label: '技能', visible: true },
  { id: 'languages', type: 'languages', label: '语言能力', visible: true },
];

function getSampleData(lang: Language): ResumeData {
  if (lang === 'en') return enSample;
  if (lang === 'de') return deSample;
  return zhSample;
}

interface ResumeState {
  resumeData: ResumeData;
  markdownContent: string;
  editorMode: EditorMode;
  template: TemplateType;
  sectionOrder: SectionOrder[];
  language: Language;
  editingSection: string | null;
  editingField: { section: string; field: string; index?: number } | null;

  setEditorMode: (mode: EditorMode) => void;
  setTemplate: (template: TemplateType) => void;
  setLanguage: (language: Language) => void;
  updateMarkdown: (content: string) => void;
  syncFromMarkdown: () => void;
  syncToMarkdown: () => void;
  setResumeData: (data: ResumeData) => void;
  updatePersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void;
  updateSectionLabel: (sectionType: string, newLabel: string) => void;
  toggleSectionVisibility: (sectionType: string) => void;
  reorderSections: (newOrder: SectionOrder[]) => void;
  setEditingSection: (section: string | null) => void;
  setEditingField: (field: { section: string; field: string; index?: number } | null) => void;
  addExperience: (exp: Omit<ResumeData['experience'][0], 'id'>) => void;
  updateExperience: (id: string, exp: Partial<ResumeData['experience'][0]>) => void;
  removeExperience: (id: string) => void;
  addEducation: (edu: Omit<ResumeData['education'][0], 'id'>) => void;
  updateEducation: (id: string, edu: Partial<ResumeData['education'][0]>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: Omit<ResumeData['skills'][0], 'id'>) => void;
  updateSkill: (id: string, skill: Partial<ResumeData['skills'][0]>) => void;
  removeSkill: (id: string) => void;
  addProject: (project: Omit<ResumeData['projects'][0], 'id'>) => void;
  updateProject: (id: string, project: Partial<ResumeData['projects'][0]>) => void;
  removeProject: (id: string) => void;
  addLanguage: (lang: { name: string; level: string }) => void;
  updateLanguage: (id: string, lang: Partial<{ name: string; level: string }>) => void;
  removeLanguage: (id: string) => void;
  fillSampleData: () => void;
  clearData: () => void;
}

const emptyResume: ResumeData = {
  personalInfo: { fullName: '', email: '', phone: '', location: '', linkedin: '', website: '', summary: '' },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  languages: [],
};

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      resumeData: zhSample,
      markdownContent: resumeToMarkdown(zhSample),
      editorMode: 'visual',
      template: 'modern',
      sectionOrder: defaultSectionOrder,
      language: 'zh',
      editingSection: null,
      editingField: null,

      setEditorMode: (mode) => set({ editorMode: mode }),
      setTemplate: (template) => set({ template }),

      setLanguage: (language) => {
        const labels = {
          zh: { personal: '个人信息', summary: '个人简介', experience: '工作经验', education: '教育背景', projects: '项目经历', skills: '技能', languages: '语言能力' },
          en: { personal: 'Personal Info', summary: 'Summary', experience: 'Experience', education: 'Education', projects: 'Projects', skills: 'Skills', languages: 'Languages' },
          de: { personal: 'Persönliche Daten', summary: 'Zusammenfassung', experience: 'Berufserfahrung', education: 'Ausbildung', projects: 'Projekte', skills: 'Fähigkeiten', languages: 'Sprachen' },
        };
        const sectionOrder = defaultSectionOrder.map(s => ({
          ...s,
          label: labels[language][s.type as keyof typeof labels.zh],
        }));
        set({ language, sectionOrder });
      },

      updateMarkdown: (content) => set({ markdownContent: content }),

      syncFromMarkdown: () => {
        const { markdownContent } = get();
        const parsed = markdownToResume(markdownContent);
        set((state) => ({
          resumeData: { ...state.resumeData, ...parsed } as ResumeData,
        }));
      },

      syncToMarkdown: () => {
        const { resumeData } = get();
        set({ markdownContent: resumeToMarkdown(resumeData) });
      },

      setResumeData: (data) => set({ resumeData: data }),

      updatePersonalInfo: (info) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            personalInfo: { ...state.resumeData.personalInfo, ...info },
          },
        })),

      updateSectionLabel: (sectionType, newLabel) =>
        set((state) => ({
          sectionOrder: state.sectionOrder.map((s) =>
            s.type === sectionType ? { ...s, label: newLabel } : s
          ),
        })),

      toggleSectionVisibility: (sectionType) =>
        set((state) => ({
          sectionOrder: state.sectionOrder.map((s) =>
            s.type === sectionType ? { ...s, visible: !s.visible } : s
          ),
        })),

      reorderSections: (newOrder) => set({ sectionOrder: newOrder }),

      setEditingSection: (section) => set({ editingSection: section }),
      setEditingField: (field) => set({ editingField: field }),

      addExperience: (exp) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            experience: [...state.resumeData.experience, { ...exp, id: crypto.randomUUID() }],
          },
        })),

      updateExperience: (id, exp) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            experience: state.resumeData.experience.map((e) => (e.id === id ? { ...e, ...exp } : e)),
          },
        })),

      removeExperience: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            experience: state.resumeData.experience.filter((e) => e.id !== id),
          },
        })),

      addEducation: (edu) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: [...state.resumeData.education, { ...edu, id: crypto.randomUUID() }],
          },
        })),

      updateEducation: (id, edu) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: state.resumeData.education.map((e) => (e.id === id ? { ...e, ...edu } : e)),
          },
        })),

      removeEducation: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            education: state.resumeData.education.filter((e) => e.id !== id),
          },
        })),

      addSkill: (skill) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: [...state.resumeData.skills, { ...skill, id: crypto.randomUUID() }],
          },
        })),

      updateSkill: (id, skill) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: state.resumeData.skills.map((s) => (s.id === id ? { ...s, ...skill } : s)),
          },
        })),

      removeSkill: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            skills: state.resumeData.skills.filter((s) => s.id !== id),
          },
        })),

      addProject: (project) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            projects: [...state.resumeData.projects, { ...project, id: crypto.randomUUID() }],
          },
        })),

      updateProject: (id, project) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            projects: state.resumeData.projects.map((p) => (p.id === id ? { ...p, ...project } : p)),
          },
        })),

      removeProject: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            projects: state.resumeData.projects.filter((p) => p.id !== id),
          },
        })),

      addLanguage: (lang) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            languages: [...state.resumeData.languages, { ...lang, id: crypto.randomUUID() }],
          },
        })),

      updateLanguage: (id, lang) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            languages: state.resumeData.languages.map((l) => (l.id === id ? { ...l, ...lang } : l)),
          },
        })),

      removeLanguage: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            languages: state.resumeData.languages.filter((l) => l.id !== id),
          },
        })),

      fillSampleData: () => {
        const lang = get().language;
        const sample = getSampleData(lang);
        set({ resumeData: sample, markdownContent: resumeToMarkdown(sample) });
      },

      clearData: () => {
        set({ resumeData: emptyResume, markdownContent: resumeToMarkdown(emptyResume) });
      },
    }),
    {
      name: 'super-resume-storage',
      version: 1,
    }
  )
);