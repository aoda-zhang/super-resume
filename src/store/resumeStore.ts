import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ResumeData, TemplateType, Experience, Education, Skill, Project } from '../types/resume';
import { resumeToMarkdown, markdownToResume } from '../utils/markdown';

export type EditorMode = 'markdown' | 'visual';

interface SectionOrder {
  id: string;
  type: 'personal' | 'summary' | 'experience' | 'education' | 'projects' | 'skills' | 'languages';
  label: string;
  visible: boolean;
}

const initialResumeData: ResumeData = {
  personalInfo: {
    fullName: '张三',
    email: 'zhangsan@example.com',
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

const defaultSectionOrder: SectionOrder[] = [
  { id: 'personal', type: 'personal', label: '个人信息', visible: true },
  { id: 'summary', type: 'summary', label: '个人简介', visible: true },
  { id: 'experience', type: 'experience', label: '工作经验', visible: true },
  { id: 'education', type: 'education', label: '教育背景', visible: true },
  { id: 'projects', type: 'projects', label: '项目经历', visible: true },
  { id: 'skills', type: 'skills', label: '技能', visible: true },
  { id: 'languages', type: 'languages', label: '语言能力', visible: true },
];

interface ResumeState {
  // 数据
  resumeData: ResumeData;
  markdownContent: string;
  
  // UI 状态
  editorMode: EditorMode;
  template: TemplateType;
  sectionOrder: SectionOrder[];
  editingSection: string | null;
  editingField: { section: string; field: string; index?: number } | null;
  
  // 操作方法
  setEditorMode: (mode: EditorMode) => void;
  setTemplate: (template: TemplateType) => void;
  
  // Markdown 相关
  updateMarkdown: (content: string) => void;
  syncFromMarkdown: () => void;
  syncToMarkdown: () => void;
  
  // 数据更新
  setResumeData: (data: ResumeData) => void;
  updatePersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void;
  updateSectionLabel: (sectionType: string, newLabel: string) => void;
  toggleSectionVisibility: (sectionType: string) => void;
  reorderSections: (newOrder: SectionOrder[]) => void;
  
  // 编辑状态
  setEditingSection: (section: string | null) => void;
  setEditingField: (field: { section: string; field: string; index?: number } | null) => void;
  
  // 条目操作
  addExperience: (exp: Omit<Experience, 'id'>) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  addEducation: (edu: Omit<Education, 'id'>) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;
  addSkill: (skill: Omit<Skill, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  addProject: (project: Omit<Project, 'id'>) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  removeProject: (id: string) => void;
  addLanguage: (lang: { name: string; level: string }) => void;
  updateLanguage: (id: string, lang: Partial<{ name: string; level: string }>) => void;
  removeLanguage: (id: string) => void;
  
  resetResume: () => void;
}

export const useResumeStore = create<ResumeState>()(
  persist(
    (set, get) => ({
      resumeData: initialResumeData,
      markdownContent: resumeToMarkdown(initialResumeData),
      editorMode: 'markdown',
      template: 'modern',
      sectionOrder: defaultSectionOrder,
      editingSection: null,
      editingField: null,
      
      setEditorMode: (mode) => set({ editorMode: mode }),
      setTemplate: (template) => set({ template }),
      
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
            experience: state.resumeData.experience.map((e) =>
              e.id === id ? { ...e, ...exp } : e
            ),
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
            education: state.resumeData.education.map((e) =>
              e.id === id ? { ...e, ...edu } : e
            ),
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
            skills: state.resumeData.skills.map((s) =>
              s.id === id ? { ...s, ...skill } : s
            ),
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
            projects: state.resumeData.projects.map((p) =>
              p.id === id ? { ...p, ...project } : p
            ),
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
            languages: state.resumeData.languages.map((l) =>
              l.id === id ? { ...l, ...lang } : l
            ),
          },
        })),
      
      removeLanguage: (id) =>
        set((state) => ({
          resumeData: {
            ...state.resumeData,
            languages: state.resumeData.languages.filter((l) => l.id !== id),
          },
        })),
      
      resetResume: () => {
        set({ resumeData: initialResumeData, markdownContent: resumeToMarkdown(initialResumeData) });
      },
    }),
    {
      name: 'resume-storage-v2',
    }
  )
);
