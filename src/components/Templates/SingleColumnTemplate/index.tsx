/**
 * SingleColumnTemplate
 * Clean single-column layout. Assembles section components.
 */
import { useTemplateData } from "../shared/useTemplateData";
import { singleColumnStyles as s } from "../shared/templateStyles";
import { PersonalSection } from "./PersonalSection";
import { SummarySection } from "./SummarySection";
import { ExperienceSection } from "./ExperienceSection";
import { EducationSection } from "./EducationSection";
import { ProjectSection } from "./ProjectSection";
import { SkillsSection } from "./SkillsSection";
import { LanguagesSection } from "./LanguagesSection";
import { InterestsSection } from "./InterestsSection";
import type { Experience, Education, Project, Language } from "../../../types/resume";

export function SingleColumnTemplate() {
  const {
    t,
    tEditor,
    present,
    personalInfo,
    summary,
    experience,
    education,
    skills,
    projects,
    languages,
    interests,
    visibleSections,
    contactFields,
    fieldLabels,
    updatePersonalInfo,
    updateResumeData,
    updateExperience,
    updateEducation,
    updateProject,
    updateLanguage,
  } = useTemplateData();

  const handlePersonalField = (field: string, value: string) => {
    updatePersonalInfo({ [field]: value } as any);
  };

  return (
    <div
      className="bg-white font-sans"
      style={{ padding: s.padding, boxSizing: "border-box", width: "100%" }}
    >
      {visibleSections.map((section) => {
        switch (section.type) {
          case "personal":
            return (
              <PersonalSection
                key={section.id}
                personalInfo={personalInfo}
                contactFields={contactFields}
                fieldLabels={fieldLabels}
                t={t}
                onUpdateField={handlePersonalField}
              />
            );
          case "summary":
            return (
              <SummarySection
                key={section.id}
                value={summary}
                t={t}
                tEditor={tEditor}
                onUpdate={(v) => updateResumeData({ summary: v })}
              />
            );
          case "experience":
            return (
              <ExperienceSection
                key={section.id}
                experience={experience}
                t={t}
                tEditor={tEditor}
                present={present}
                onUpdate={updateExperience as (id: string, data: Partial<Experience>) => void}
              />
            );
          case "education":
            return (
              <EducationSection
                key={section.id}
                education={education}
                t={t}
                tEditor={tEditor}
                present={present}
                onUpdate={updateEducation as (id: string, data: Partial<Education>) => void}
              />
            );
          case "projects":
            return (
              <ProjectSection
                key={section.id}
                projects={projects}
                t={t}
                tEditor={tEditor}
                onUpdate={updateProject as (id: string, data: Partial<Project>) => void}
              />
            );
          case "skills":
            return (
              <SkillsSection
                key={section.id}
                skills={skills}
                tEditor={tEditor}
              />
            );
          case "languages":
            return (
              <LanguagesSection
                key={section.id}
                languages={languages as Language[]}
                tEditor={tEditor}
                onUpdate={updateLanguage as (id: string, data: Partial<Language>) => void}
              />
            );
          case "interests":
            return (
              <InterestsSection
                key={section.id}
                interests={interests}
                t={t}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
