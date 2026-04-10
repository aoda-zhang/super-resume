export interface PersonalInfo {
  fullName: string;
  title?: string; // 职位
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  summary?: string;
  nationality?: string;
  photo?: string; // base64 or URL
  interests?: string;
  github?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  location?: string;  // e.g. "Düsseldorf, Germany (Remote)"
  techStack?: string; // e.g. "React, Node.js, GraphQL, AWS"
}

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Skill {
  id: string;
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  link?: string;
  technologies: string[];
}

export interface Language {
  id: string;
  name: string;
  level: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  experience: Experience[];
  education: Education[];
  skills: Skill[];
  projects: Project[];
  languages: Language[];
}

export type TemplateType = 'modern' | 'classic' | 'minimal' | 'german';
