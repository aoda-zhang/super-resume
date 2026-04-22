import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ResumeData, TemplateType } from '../types/resume';
import { resumeToMarkdown, markdownToResume } from '../utils/markdown';

export type EditorMode = 'markdown' | 'visual';

export type Language = 'zh' | 'en' | 'de';

interface SectionOrder {
  id: string;
  type: 'personal' | 'summary' | 'experience' | 'education' | 'projects' | 'skills' | 'additionalSkills';
  label: string;
  visible: boolean;
}

/** 个人信息的子字段排序 */
export type PersonalInfoFieldType =
  | 'fullName' | 'title'
  | 'email' | 'phone' | 'address'
  | 'nationality' | 'birthDate' | 'workPermit' | 'residenceStatus' | 'blueCard'
  | 'linkedin' | 'github' | 'website';

export const defaultPersonalInfoFieldOrder: PersonalInfoFieldType[] = [
  'fullName', 'title',
  'address', 'phone', 'email',
  'birthDate', 'nationality',
  'linkedin', 'github', 'website',
  'workPermit', 'residenceStatus', 'blueCard',
];

export const personalInfoFieldMeta: Record<PersonalInfoFieldType, { rows: number }> = {
  fullName: { rows: 1 },
  title: { rows: 1 },
  email: { rows: 1 },
  phone: { rows: 1 },
  address: { rows: 1 },
  nationality: { rows: 1 },
  birthDate: { rows: 1 },
  workPermit: { rows: 1 },
  residenceStatus: { rows: 1 },
  blueCard: { rows: 1 },
  linkedin: { rows: 1 },
  github: { rows: 1 },
  website: { rows: 1 },
};

const zhSample: ResumeData = {
  personalInfo: {
    fullName: 'John Smith',
    email: 'zhangming@example.com',
    phone: '138-0000-0000',
    address: 'BeijingCity',
    linkedin: '',
    website: '',
  },
  summary: '5年全栈开发经验，擅长React与Node.js技术栈，热衷开源与技术社区。',
  experience: [
    {
      id: '1',
      company: 'Tech Co., Ltd.',
      position: 'AdvancedFrontendEngineer',
      startDate: '2022-01',
      endDate: '',
      current: true,
      description: 'Responsible forcompany core productsFrontendarchitecture designanddevelopment\nled5person team to complete multiple key projects\noptimizeFrontendperformance，first screen loadingTimereduce50%',
    },
    {
      id: '2',
      company: 'Internet Company',
      position: 'FrontendEngineer',
      startDate: '2020-06',
      endDate: '2021-12',
      current: false,
      description: 'participated in e-commerce platformFrontenddevelopment\nimplemented complex interactive featuresandanimation effects\nworked closely with designers，ensuredUI/UXquality',
    },
  ],
  education: [
    {
      id: '1',
      school: 'BeijingUniversity',
      degree: "Bachelor's degree",
      field: 'Computer Science and Tech',
      startDate: '2016-09',
      endDate: '2020-06',
      current: false,
    },
  ],
  skills: [
    { id: '1', name: 'React', level: 'expert', category: '前端' },
    { id: '2', name: 'TypeScript', level: 'expert', category: '前端' },
    { id: '3', name: 'Node.js', level: 'advanced', category: '后端' },
    { id: '4', name: 'Python', level: 'intermediate', category: '后端' },
  ],
  projects: [
    {
      id: '1',
      name: 'open-source component library',
      description: 'based on React UI component library, provides 50+ high-quality components, GitHub Stars 2k+',
      link: 'https://github.com/example/ui-lib',
      technologies: ['React', 'TypeScript', 'Rollup'],
    },
  ],
  languages: [
    { id: '1', name: 'Chinese', level: 'Native' },
    { id: '2', name: 'English', level: 'Fluent' },
  ],
  interests: '',
};

const enSample: ResumeData = {
  personalInfo: {
    fullName: 'John Smith',
    email: 'john@example.com',
    phone: '+1 234 567 8900',
    address: 'San Francisco, CA',
    linkedin: 'linkedin.com/in/johnsmith',
    website: 'johnsmith.dev',
  },
  summary: '5+ years of full-stack development experience, specializing in React and Node.js.',
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
    { id: '1', name: 'React', level: 'expert', category: '前端' },
    { id: '2', name: 'TypeScript', level: 'expert', category: '前端' },
    { id: '3', name: 'Node.js', level: 'advanced', category: '后端' },
    { id: '4', name: 'Python', level: 'intermediate', category: '后端' },
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
  interests: '',
};

const deSample: ResumeData = {
  personalInfo: {
    fullName: 'Jennifer Palacios',
    email: 'jennifer.palacios@gmail.com',
    phone: '+49 170 1234567',
    address: 'Düsseldorf, Deutschland',
    linkedin: 'linkedin.com/in/jenpalacios',
    github: 'github.com/JenPalacios',
    website: 'jenpalacios.com',
    nationality: 'Guatemalan',
  },
  summary: 'Erfahrene Full-Stack-Entwicklerin mit Fokus auf JavaScript und Clean-Code-Praktiken.',
  experience: [
    {
      id: '1',
      company: 'Grid App',
      position: 'Software Engineer (Mobile & Web)',
      startDate: '10/2020',
      endDate: '',
      current: true,
      address: 'Düsseldorf, Deutschland (Remote)',
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
      address: 'Düsseldorf, Deutschland',
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
      address: 'Düsseldorf, Deutschland',
      description: '• Technischen Schulden um 10% durch Vereinfachung von API-Aufrufen reduziert\n• Teilnahme am High-Pressure-iPhone-Launch mit Echtzeit-Updates',
    },
    {
      id: '4',
      company: 'Parasol Island',
      position: 'Web Developer',
      startDate: '05/2017',
      endDate: '04/2018',
      current: false,
      address: 'Düsseldorf, Deutschland',
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
  interests: '',
};

const defaultSectionOrder: SectionOrder[] = [
  { id: 'personal', type: 'personal', label: 'PersonalInfo', visible: true },
  { id: 'summary', type: 'summary', label: 'PersonalDescription', visible: true },
  { id: 'skills', type: 'skills', label: 'Skills', visible: true },
  { id: 'experience', type: 'experience', label: 'WorkExperience', visible: true },
  { id: 'education', type: 'education', label: 'Education', visible: true },
  { id: 'projects', type: 'projects', label: 'Projects', visible: true },
  { id: 'additionalSkills', type: 'additionalSkills', label: 'Additional Skills', visible: true },
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
  resetSectionOrder: () => void;
  personalInfoFieldOrder: PersonalInfoFieldType[];
  reorderPersonalInfoFields: (newOrder: PersonalInfoFieldType[]) => void;
  resetPersonalInfoFieldOrder: () => void;
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
  personalInfo: { fullName: '', email: '', phone: '', address: '', linkedin: '', website: '' },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  projects: [],
  languages: [],
  interests: '',
};

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      resumeData: zhSample,
      markdownContent: resumeToMarkdown(zhSample),
      editorMode: 'visual',
      template: 'modern',
      sectionOrder: defaultSectionOrder,
      personalInfoFieldOrder: defaultPersonalInfoFieldOrder,
      language: 'zh',
      editingSection: null,
      editingField: null,

      setEditorMode: (mode) => set({ editorMode: mode }),
      setTemplate: (template) => set({ template }),

      setLanguage: (language) => {
        const labels = {
          zh: { personal: '基本信息', summary: '自我评价', experience: '工作经历', education: '教育经历', projects: '项目经验', skills: '专业技能', languages: '语言能力', interests: '兴趣爱好' },
          en: { personal: 'Personal Info', summary: 'Professional summary', experience: 'Work Experience', education: 'Education', projects: 'Projects', skills: 'Skills', languages: 'Languages', interests: 'Interests' },
          de: { personal: 'Persönliche Daten', summary: 'Zusammenfassung', experience: 'Berufserfahrung', education: 'Ausbildung', projects: 'Projekte', skills: 'Fähigkeiten', languages: 'Sprachen', interests: 'Hobbys' },
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

      resetSectionOrder: () => set({ sectionOrder: defaultSectionOrder }),

      reorderPersonalInfoFields: (newOrder) =>
        set({ personalInfoFieldOrder: newOrder }),

      resetPersonalInfoFieldOrder: () =>
        set({ personalInfoFieldOrder: defaultPersonalInfoFieldOrder }),

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

      updateInterests: (value: string) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            interests: value,
          },
        })),

      fillSampleData: () => {
        const lang = get().language;
        const sample = getSampleData(lang);
        set({ resumeData: sample, markdownContent: resumeToMarkdown(sample) });
      },

      clearData: () => {
        set({
          resumeData: emptyResume,
          markdownContent: resumeToMarkdown(emptyResume),
          personalInfoFieldOrder: defaultPersonalInfoFieldOrder,
        });
      },
    }),
    {
      name: 'super-resume-storage',
      version: 1,
    }
  )
);