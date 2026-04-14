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
                value={summary || ""}
                onChange={(v) => updateResumeData({ summary: v })}
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
              <div
                key={exp.id}
                className="grid"
                style={{ gridTemplateColumns: "150px 1fr", alignItems: "start" }}
              >
                <div className="pr-4 text-slate-900 whitespace-nowrap border-r border-slate-200 h-full" style={{ fontSize: s.body.fontSize }}>
                  <div>{exp.startDate} - {exp.endDate || (present ? t.current : "")}</div>
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
          <section className="mb-4">
            <SectionTitle
              label={tEditor.education}
              sectionType="education"
              className={s.label}
              style={s.sectionTitle}
            />
            {education.map((edu) => (
              <div
                key={edu.id}
                className="grid"
                style={{ gridTemplateColumns: "150px 1fr", alignItems: "start" }}
              >
                <div className="pr-4 text-slate-900 whitespace-nowrap border-r border-slate-200" style={{ fontSize: s.body.fontSize }}>
                  <span>
                    {edu.startDate}{edu.startDate ? " - " : ""}{edu.current ? present : edu.endDate}
                  </span>
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

        const ungrouped = skills.filter(sk => !sk.category?.trim());
        const seen = new Set<string>();
        const groupedEntries: Array<{ cat: string; list: typeof skills }> = [];
        skills.forEach(sk => {
          const cat = sk.category?.trim();
          if (cat && !seen.has(cat)) {
            seen.add(cat);
            groupedEntries.push({ cat, list: skills.filter(s => s.category?.trim() === cat) });
          }
        });

        return (
          <section className="mb-4">
            <SectionTitle
              label={tEditor.skills}
              sectionType="skills"
              className={s.label}
              style={s.sectionTitle}
            />
            {groupedEntries.map(({ cat, list: catSkills }) => (
              <div key={cat} className="mb-2 last:mb-0">
                <div className="text-slate-400 text-xs mb-0.5 uppercase tracking-wide">{cat}</div>
                <div className="space-y-0.5 text-slate-900" style={s.body}>
                  {catSkills.map((skill) => (
                    <SkillEntry key={skill.id} skill={skill} onUpdate={updateSkill} />
                  ))}
                </div>
              </div>
            ))}
            {ungrouped.length > 0 && (
              <div className="space-y-0.5 text-slate-900" style={s.body}>
                {ungrouped.map((skill) => (
                  <SkillEntry key={skill.id} skill={skill} onUpdate={updateSkill} />
                ))}
              </div>
            )}
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
