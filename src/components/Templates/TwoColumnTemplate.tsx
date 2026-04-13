/**
 * TwoColumnTemplate
 * Left sidebar (photo, personal info, skills, languages) + right main column.
 */
import { EditableText } from "./EditableComponents";
import { useTemplateData } from "./shared/useTemplateData";
import {
  Photo,
  SectionTitle,
  ExperienceEntry,
  EducationEntry,
  ProjectEntry,
  SkillEntry,
  LanguageEntry,
} from "./shared/SectionRenderers";
import { twoColumnStyles as s } from "./shared/templateStyles";

export function TwoColumnTemplate() {
  const {
    t,
    tEditor,
    present,
    personalInfo,
    experience,
    education,
    skills,
    projects,
    languages,
    visibleSections,
    contactFields,
    fieldLabels,
    updatePersonalInfo,
    updateExperience,
    updateEducation,
    updateSkill,
    updateProject,
    updateLanguage,
  } = useTemplateData();

  const leftColumnTypes = ["personal", "skills", "languages"];
  const leftSections = visibleSections.filter((s) => leftColumnTypes.includes(s.type));
  const rightSections = visibleSections.filter((s) => !leftColumnTypes.includes(s.type));

  const renderSection = (section: (typeof visibleSections)[0]) => {
    switch (section.type) {
      // ----------------------------------------------------------------- //
      case "personal":
        return (
          <div className="mb-4">
            {personalInfo.fullName && (
              <h1 style={s.name} className="text-slate-900 mb-1">
                <EditableText
                  value={personalInfo.fullName}
                  onChange={(v) => updatePersonalInfo({ fullName: v })}
                  placeholder={t.name}
                />
              </h1>
            )}
            {personalInfo.title && (
              <p style={s.title} className="text-slate-900 mb-3">
                <EditableText
                  value={personalInfo.title}
                  onChange={(v) => updatePersonalInfo({ title: v })}
                  placeholder={t.title}
                />
              </p>
            )}
            <div className="space-y-0.5 text-slate-900" style={s.body}>
              {contactFields.map((f) => (
                <div key={f} className="flex items-baseline gap-1 min-w-0">
                  <span className="font-bold flex-shrink-0 whitespace-nowrap">{fieldLabels[f]}：</span>
                  <EditableText
                    value={(personalInfo[f as keyof typeof personalInfo] as string) || ""}
                    onChange={(v) => updatePersonalInfo({ [f]: v } as any)}
                    placeholder={fieldLabels[f]}
                    className="min-w-0 break-words"
                  />
                </div>
              ))}
            </div>
          </div>
        );

      // ----------------------------------------------------------------- //
      case "summary":
        return (
          <section className="mb-4">
            <SectionTitle
              label={tEditor.summary}
              sectionType="summary"
              className={s.label}
              style={s.sectionTitle}
            />
            <p className="leading-relaxed text-slate-900" style={s.body}>
              <EditableText
                value={personalInfo.summary || ""}
                onChange={(v) => updatePersonalInfo({ summary: v })}
                placeholder={t.summaryPlaceholder}
                multiline
                className="w-full"
              />
            </p>
          </section>
        );

      // ----------------------------------------------------------------- //
      case "experience":
        if (experience.length === 0) return null;
        return (
          <section className="mb-4">
            <SectionTitle
              label={tEditor.experience}
              sectionType="experience"
              className={s.label}
              style={s.sectionTitle}
            />
            {experience.map((exp) => (
              <ExperienceEntry
                key={exp.id}
                exp={exp}
                t={t}
                present={present}
                onUpdate={updateExperience}
                styles={{ description: s.body }}
              />
            ))}
          </section>
        );

      // ----------------------------------------------------------------- //
      case "education":
        if (education.length === 0) return null;
        return (
          <section className="mb-4">
            <SectionTitle
              label={tEditor.education}
              sectionType="education"
              className={s.label}
              style={s.sectionTitle}
            />
            {education.map((edu) => (
              <EducationEntry
                key={edu.id}
                edu={edu}
                t={t}
                present={present}
                onUpdate={updateEducation}
                styles={{ field: s.body }}
              />
            ))}
          </section>
        );

      // ----------------------------------------------------------------- //
      case "projects":
        if (projects.length === 0) return null;
        return (
          <section className="mb-4">
            <SectionTitle
              label={tEditor.projects}
              sectionType="projects"
              className={s.label}
              style={s.sectionTitle}
            />
            {projects.map((proj) => (
              <ProjectEntry
                key={proj.id}
                proj={proj}
                t={t}
                onUpdate={updateProject}
                styles={{ description: s.body }}
              />
            ))}
          </section>
        );

      // ----------------------------------------------------------------- //
      case "skills":
        if (skills.length === 0) return null;
        return (
          <section className="mb-4">
            <SectionTitle
              label={tEditor.skills}
              sectionType="skills"
              className={s.label}
              style={s.sectionTitle}
            />
            <div className="space-y-0.5 text-slate-900" style={s.body}>
              {skills.map((skill) => (
                <SkillEntry
                  key={skill.id}
                  skill={skill}
                  onUpdate={updateSkill}
                />
              ))}
            </div>
          </section>
        );

      // ----------------------------------------------------------------- //
      case "languages":
        if (languages.length === 0) return null;
        return (
          <section className="mb-4">
            <SectionTitle
              label={tEditor.languages}
              sectionType="languages"
              className={s.label}
              style={s.sectionTitle}
            />
            <div className="space-y-0.5 text-slate-900" style={s.body}>
              {languages.map((lang) => (
                <LanguageEntry
                  key={lang.id}
                  lang={lang}
                  onUpdate={updateLanguage}
                />
              ))}
            </div>
          </section>
        );

      // ----------------------------------------------------------------- //
      default:
        return null;
    }
  };

  return (
    <div
      className="bg-white font-sans flex"
      style={{ minHeight: "297mm", boxSizing: "border-box", width: "100%" }}
    >
      {/* ── Left sidebar ── */}
      <div
        className="flex-shrink-0 bg-slate-50 border-r border-slate-200"
        style={{ width: s.sidebarWidth, padding: s.sidebarPadding }}
      >
        {personalInfo.photo && (
          <div className="mb-4 flex justify-center">
            <Photo
              src={personalInfo.photo}
              size={s.photoSize}
              className="rounded-full border-4 border-slate-300"
            />
          </div>
        )}
        {leftSections.map((section) => (
          <div key={section.id}>{renderSection(section)}</div>
        ))}
      </div>

      {/* ── Right main column ── */}
      <div
        className="flex-1"
        style={{ width: s.mainWidth, padding: s.mainPadding }}
      >
        {rightSections.map((section) => (
          <div key={section.id}>{renderSection(section)}</div>
        ))}
      </div>
    </div>
  );
}
