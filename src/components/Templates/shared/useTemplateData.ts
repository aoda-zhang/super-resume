import { useResumeStore } from "../../../store/resumeStore";
import { useResumeEditing } from "../EditableComponents";
import { translations } from "../../../i18n";
import type { PersonalInfoFieldType } from "../../../store/resumeStore";

/**
 * Shared hook: extracts all common data/logic that every template needs.
 * Templates should call this once and destructure what they need.
 */
export function useTemplateData() {
  const language = useResumeStore((s) => s.language);
  const t = translations[language].form;
  const tEditor = translations[language].editor;
  const present = translations[language].form.current;

  const {
    resumeData,
    visibleSections,
    personalInfoFields,
    updatePersonalInfo,
  updateResumeData,
    updateExperience,
    updateEducation,
    updateSkill,
    updateProject,
    updateLanguage,
  } = useResumeEditing();

  const { personalInfo, summary, experience, education, skills, projects, languages } =
    resumeData;

  /** Contact fields that have a value (excluding fullName & title which render separately) */
  const contactFields = personalInfoFields.filter((f) => {
    if (f === "fullName" || f === "title") return false;
    const v = personalInfo[f as keyof typeof personalInfo];
    return typeof v === "string" && v.trim() !== "";
  });

  /** Localised labels for every personal-info field */
  const fieldLabels: Record<PersonalInfoFieldType, string> = {
    fullName: t.name,
    title: t.title,
    email: t.email,
    phone: t.phone,
    address: t.address,
    nationality: t.nationality,
    birthDate: t.birthDate,
    workPermit: t.workPermit,
    blueCard: t.blueCard,
    linkedin: t.linkedin,
    github: t.github,
    website: t.website,
  };

  return {
    // i18n
    t,
    tEditor,
    present,
    language,
    // data
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    languages,
    // layout
    visibleSections,
    contactFields,
    fieldLabels,
    // updaters
    updatePersonalInfo,
    updateResumeData,
    updateExperience,
    updateEducation,
    updateSkill,
    updateProject,
    updateLanguage,
  };
}

export type TemplateData = ReturnType<typeof useTemplateData>;
