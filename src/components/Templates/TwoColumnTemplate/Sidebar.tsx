
/**
 * Two-column layout: left sidebar container.
 * Assembles section components for the sidebar column.
 */
import { PersonalSection } from "./PersonalSection";
import { ContactSection } from "./ContactSection";
import { SkillsSection } from "./SkillsSection";
import { LanguagesSection } from "./LanguagesSection";
import type { Skill, Language } from "../../../types/resume";

interface SidebarProps {
  personalInfo: {
    fullName: string;
    title: string;
    photo?: string;
    email?: string;
    phone?: string;
    address?: string;
    linkedin?: string;
    website?: string;
    github?: string;
    nationality?: string;
    birthDate?: string;
    workPermit?: string;
    blueCard?: string;
  };
  skills: Skill[];
  languages: Language[];
  contactFields: string[];
  fieldLabels: Record<string, string>;
  t: Record<string, string>;
  tEditor: Record<string, string>;
  onUpdateField: (field: string, value: string) => void;
  onUpdateSkill: (id: string, data: Partial<Skill>) => void;
  onUpdateLanguage: (id: string, data: Partial<Language>) => void;
}

export function Sidebar({
  personalInfo,
  skills,
  languages,
  contactFields,
  fieldLabels,
  t,
  tEditor,
  onUpdateField,
  onUpdateSkill,
  onUpdateLanguage,
}: SidebarProps) {
  return (
    <div className="mb-4">
      <PersonalSection
        photo={personalInfo.photo}
        fullName={personalInfo.fullName}
        title={personalInfo.title}
        t={t}
        onUpdateField={onUpdateField}
      />

      <ContactSection
        personalInfo={personalInfo}
        contactFields={contactFields}
        fieldLabels={fieldLabels}
        onUpdateField={onUpdateField}
      />

      <SkillsSection
        skills={skills}
        tEditor={tEditor}
        onUpdate={onUpdateSkill}
      />

      <LanguagesSection
        languages={languages}
        tEditor={tEditor}
        onUpdate={onUpdateLanguage}
      />
    </div>
  );
}
