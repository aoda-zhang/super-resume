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
    summary,
    experience,
    education,
    skills,
    projects,
    languages,
    visibleSections,
    contactFields,
    fieldLabels,
    updatePersonalInfo,
    updateResumeData,
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
              {/* Left: name + title + contacts */}
              <div className="flex-1 min-w-0">
                {personalInfo.fullName && (
                  <h1 style={s.name} className="text-slate-900 mb-1 wrap-break-word">
                    <EditableText
                      value={personalInfo.fullName}
                      onChange={(v) => updatePersonalInfo({ fullName: v })}
                      placeholder={t.name}
                    />
                  </h1>
                )}
                {personalInfo.title && (
                  <p style={s.title} className="text-sky-700 mb-3 wrap-break-word">
                    <EditableText
                      value={personalInfo.title}
                      onChange={(v) => updatePersonalInfo({ title: v })}
                      placeholder={t.title}
                    />
                  </p>
                )}

                {/* Contact fields — fixed 2 columns, content wraps inside each cell */}
                <div
                  className="mt-2 grid gap-y-1 text-slate-900"
                  style={{ ...s.body, gridTemplateColumns: "1fr 1fr" }}
                >
                  {contactFields.map((f) => (
                    <div key={f} className="flex items-baseline mr-10">
                      <span className="font-bold shrink-0 whitespace-nowrap">
                        {fieldLabels[f]}：
                      </span>
                      <EditableText
                        value={(personalInfo[f as keyof typeof personalInfo] as string) || ""}
                        onChange={(v) => updatePersonalInfo({ [f]: v } as any)}
                        placeholder={fieldLabels[f]}
                        className="min-w-0 wrap-break-word"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: photo */}
              {personalInfo.photo && (
                <div className="shrink-0">
                  <Photo
                    src={personalInfo.photo}
                    size={114}
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
            <p className="leading-relaxed text-slate-900 wrap-break-word" style={s.body}>
              <EditableText
                value={summary || ""}
                onChange={(v) => updateResumeData({ summary: v })}
                placeholder={t.summaryPlaceholder}
                multiline
                className="w-full wrap-break-word"
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
              <div
                key={exp.id}
                className="grid"
                style={{ gridTemplateColumns: "160px 1fr", alignItems: "start" }}
              >
                <div className="pr-4 text-slate-900 whitespace-nowrap border-r border-slate-200" style={{ fontSize: s.body.fontSize }}>
                  {exp.startDate} - {exp.endDate || (present ? t.current : "")}
                  {exp.address && <div className="text-slate-500 mt-0.5">{exp.address}</div>}
                </div>
                <div className="min-w-0 pl-4">
                  <ExperienceEntry
                    exp={exp}
                    t={t}
                    present={present}
                    onUpdate={updateExperience}
                    styles={{ description: s.body }}
                  />
                </div>
              </div>
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
              <div
                key={edu.id}
                className="grid mb-2"
                style={{ gridTemplateColumns: "160px 1fr", alignItems: "start" }}
              >
                <div className="pr-4 text-slate-900 whitespace-nowrap border-r border-slate-200" style={{ fontSize: s.body.fontSize }}>
                  <span>{edu.startDate}{edu.startDate ? " - " : ""}{edu.current ? present : edu.endDate}</span>
                  {edu.address && <div className="text-slate-500 mt-0.5">{edu.address}</div>}
                </div>
                <div className="text-slate-900 pl-4" style={s.body}>
                  <div className="flex items-baseline gap-4">
                    <span className="font-bold">{edu.field || t.major || "Field of Study"}</span>
                    {edu.degree && <span className="text-slate-500 shrink-0">, {edu.degree}</span>}
                  </div>
                  <div className="mt-0.5">{edu.school || t.school || "School"}</div>
                </div>
              </div>
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
                <SkillEntry key={skill.id} skill={skill} onUpdate={updateSkill} />
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
                <LanguageEntry key={lang.id} lang={lang} onUpdate={updateLanguage} />
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
