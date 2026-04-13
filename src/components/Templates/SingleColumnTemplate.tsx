/**
 * SingleColumnTemplate
 * A clean, single-column layout.
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
import { singleColumnStyles as s } from "./shared/templateStyles";

export function SingleColumnTemplate() {
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

  const renderSection = (section: (typeof visibleSections)[0]) => {
    switch (section.type) {
      // ----------------------------------------------------------------- //
      case "personal":
        return (
          <header className="mb-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
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

                {/* Contact fields — 2 per row */}
                <div className="mt-2 space-y-1" style={s.body}>
                  {Array.from({
                    length: Math.ceil(contactFields.length / 2),
                  }).map((_, rowIdx) => {
                    const left = contactFields[rowIdx * 2];
                    const right = contactFields[rowIdx * 2 + 1];
                    return (
                      <div key={rowIdx} className="flex gap-x-8">
                        {left && (
                          <div className="flex-1">
                            <span className="font-bold mr-1">
                              {fieldLabels[left]}：
                            </span>
                            <EditableText
                              value={
                                (personalInfo[
                                  left as keyof typeof personalInfo
                                ] as string) || ""
                              }
                              onChange={(v) =>
                                updatePersonalInfo({ [left]: v } as any)
                              }
                              placeholder={fieldLabels[left]}
                            />
                          </div>
                        )}
                        {right && (
                          <div className="flex-1">
                            <span className="font-bold mr-1">
                              {fieldLabels[right]}：
                            </span>
                            <EditableText
                              value={
                                (personalInfo[
                                  right as keyof typeof personalInfo
                                ] as string) || ""
                              }
                              onChange={(v) =>
                                updatePersonalInfo({ [right]: v } as any)
                              }
                              placeholder={fieldLabels[right]}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {personalInfo.photo && (
                <div className="flex-shrink-0 ml-6">
                  <Photo
                    src={personalInfo.photo}
                    size={96}
                    className="rounded-full border-2 border-slate-200"
                  />
                </div>
              )}
            </div>
          </header>
        );

      // ----------------------------------------------------------------- //
      case "summary":
        return (
          <section className="mb-5">
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
          <section className="mb-5">
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
          <section className="mb-5">
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
          <section className="mb-5">
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
          <section className="mb-5">
            <SectionTitle
              label={tEditor.skills}
              sectionType="skills"
              className={s.label}
              style={s.sectionTitle}
            />
            <div
              className="flex flex-wrap gap-x-4 gap-y-1 text-slate-900"
              style={s.body}
            >
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
          <section className="mb-5">
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
      className="bg-white font-sans"
      style={{
        padding: s.padding,
        minHeight: "297mm",
        boxSizing: "border-box",
        width: "100%",
      }}
    >
      {visibleSections.map((section) => (
        <div key={section.id}>{renderSection(section)}</div>
      ))}
    </div>
  );
}
