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
    fullName: 'Jennifer Palacios',
    email: 'jennifer.palacios@gmail.com',
    phone: '+49 170 1234567',
    location: 'Düsseldorf, Deutschland',
    linkedin: 'linkedin.com/in/jenpalacios',
    github: 'github.com/JenPalacios',
    website: 'jenpalacios.com',
    nationality: 'Guatemalan',
    summary: 'Frontend Developer mit 7 Jahren Erfahrung, spezialisiert auf JavaScript. Starke Befürworterin von Clean-Code-Praktiken durch strukturierte Code-Reviews und kollaborative Entwicklung. Interessiert an Online-Zahlungen und End-to-End-Testing.',
    interests: 'LEGO-Projekte, Holzwerken, Problemlösungs-Challenges',
  },
  experience: [
    {
      id: '1',
      company: 'Grid App',
      position: 'Software Engineer (Mobile & Web)',
      startDate: '10/2020',
      endDate: '',
      current: true,
      location: 'Düsseldorf, Deutschland (Remote)',
      techStack: 'React Native, Node.js, Vue.js, GraphQL, AWS, MongoDB',
      description: '• Verbesserung der App-Anmeldekonversion um 20% durch Vereinfachung des User-Flows\n• Automatisierung des Datei-Uploads implementiert, manuelle Prozesse ersetzt\n• Ticket-Scanning-Funktion entwickelt, um den Einlass bei Veranstaltungen zu beschleunigen\n• Mobiles Bestell- und Zahlungssystem von Grund auf neu aufgebaut',
    },
    {
      id: '2',
      company: 'Vodafone',
      position: 'Senior Frontend Developer',
      startDate: '03/2020',
      endDate: '09/2020',
      current: false,
      location: 'Düsseldorf, Deutschland',
      techStack: 'JavaScript, TypeScript, React, Docker, Cypress, GraphQL',
      description: '• Testabdeckung auf 80% durch End-to-End-Testing erhöht\n• Seitenladezeit um 80% reduziert, Conversion um 15% verbessert\n• Code-Qualität durch standardisierte Code-Review-Praktiken verbessert',
    },
    {
      id: '3',
      company: 'Vodafone',
      position: 'Frontend Developer (Online Shop)',
      startDate: '05/2018',
      endDate: '02/2020',
      current: false,
      location: 'Düsseldorf, Deutschland',
      description: '• Technischen Schulden um 10% durch Vereinfachung von API-Aufrufen reduziert\n• Teilnahme am High-Pressure-iPhone-Launch mit Echtzeit-Updates',
    },
    {
      id: '4',
      company: 'Parasol Island',
      position: 'Web Developer',
      startDate: '05/2017',
      endDate: '04/2018',
      current: false,
      location: 'Düsseldorf, Deutschland',
      description: '• 5 interaktive Kampagnen-Websites mit React und WordPress erstellt\n• Jede Kampagne erreichte ca. 150.000 tägliche Nutzer',
    },
  ],
  education: [
    {
      id: '1',
      school: 'Bloc.io (Online)',
      degree: 'Coding Bootcamp',
      field: 'Full Stack Developer Track',
      startDate: '01/2015',
      endDate: '06/2015',
      current: false,
    },
    {
      id: '2',
      school: 'Universidad Rafael Landívar, Guatemala City',
      degree: 'Bachelor Degree',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
    },
  ],
  skills: [
    { id: '1', name: 'React', level: 'expert' },
    { id: '2', name: 'React Native', level: 'expert' },
    { id: '3', name: 'TypeScript', level: 'expert' },
    { id: '4', name: 'Node.js', level: 'advanced' },
    { id: '5', name: 'GraphQL', level: 'advanced' },
    { id: '6', name: 'Docker', level: 'intermediate' },
    { id: '7', name: 'Cypress', level: 'intermediate' },
    { id: '8', name: 'AWS', level: 'intermediate' },
    { id: '9', name: 'MongoDB', level: 'intermediate' },
    { id: '10', name: 'MySQL', level: 'intermediate' },
  ],
  projects: [],
  languages: [
    { id: '1', name: 'English', level: 'C2' },
    { id: '2', name: 'Spanish', level: 'Muttersprache' },
    { id: '3', name: 'German', level: 'A1' },
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
  updateResumeData: (data: Partial<ResumeData>) => void;
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

      updateResumeData: (data: Partial<ResumeData>) =>
        set((state) => ({
          resumeData: { ...state.resumeData, ...data },
        })),

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