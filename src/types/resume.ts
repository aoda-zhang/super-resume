export interface PersonalInfo {
  fullName: string;
  title?: string;
  email: string;
  phone: string;
  address: string;
  linkedin?: string;
  website?: string;
  summary?: string;
  nationality?: string;
  birthDate?: string;
  workPermit?: string;
  blueCard?: string;
  photo?: string; // base64 or URL
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
  address?: string;  // e.g. "Düsseldorf, Germany (Remote)"
  techStack?: string; // e.g. "React, Node.js, GraphQL, AWS"
  country?: string;   // e.g. "Germany", "China"
  workMode?: string;  // e.g. "Full-time", "Part-time", "Freelance", "Internship"
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
