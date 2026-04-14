/**
 * TwoColumnTemplate
 * Left sidebar (photo + personal info + skills + languages) + right main column.
 * Assembles Sidebar and MainColumn components.
 */
import { useTemplateData } from "../shared/useTemplateData";
import { twoColumnStyles as s } from "../shared/templateStyles";
import { Sidebar } from "./Sidebar";
import { MainColumn } from "./MainColumn";
import type { Skill, Language, Experience, Education, Project } from "../../../types/resume";

export function TwoColumnTemplate() {
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
    contactFields,
    fieldLabels,
    updatePersonalInfo,
    updateResumeData,
    updateSkill,
    updateLanguage,
    updateExperience,
    updateEducation,
    updateProject,
  } = useTemplateData();

  const handlePersonalField = (field: string, value: string) => {
    updatePersonalInfo({ [field]: value } as any);
  };

  return (
    <div
      className="bg-white font-sans flex"
      style={{ boxSizing: "border-box", width: "100%" }}
    >
      {/* ── Left sidebar ── */}
      <div
        className="shrink-0 bg-slate-50 border-r border-slate-200"
        style={{ width: s.sidebarWidth, padding: s.sidebarPadding }}
      >
        <Sidebar
          personalInfo={personalInfo}
          skills={skills as Skill[]}
          languages={languages as Language[]}
          contactFields={contactFields}
          fieldLabels={fieldLabels}
          t={t}
          tEditor={tEditor}
          onUpdateField={handlePersonalField}
          onUpdateSkill={updateSkill as (id: string, data: Partial<Skill>) => void}
          onUpdateLanguage={updateLanguage as (id: string, data: Partial<Language>) => void}
        />
      </div>

      {/* ── Right main column ── */}
      <div
        className="flex-1"
        style={{ width: s.mainWidth, padding: s.mainPadding }}
      >
        <MainColumn
          summary={summary}
          experience={experience}
          education={education}
          projects={projects}
          t={t}
          tEditor={tEditor}
          present={present}
          onUpdateSummary={(v) => updateResumeData({ summary: v })}
          onUpdateExperience={updateExperience as (id: string, data: Partial<Experience>) => void}
          onUpdateEducation={updateEducation as (id: string, data: Partial<Education>) => void}
          onUpdateProject={updateProject as (id: string, data: Partial<Project>) => void}
        />
      </div>
    </div>
  );
}
