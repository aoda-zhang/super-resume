import {
  EditableText,
  EditableLabel,
  useResumeEditing,
} from "./EditableComponents";
import { useResumeStore } from "../../store/resumeStore";
import { translations } from "../../i18n";
import type { PersonalInfoFieldType } from "../../store/resumeStore";

export function GermanTemplate() {
  const language = useResumeStore((s) => s.language);
  const t = translations[language].form;
  const tEditor = translations[language].editor;
  const present = translations[language].form.current;
  const {
    resumeData,
    visibleSections,
    personalInfoFields,
    updatePersonalInfo,
    updateExperience,
    updateEducation,
    updateSkill,
    updateProject,
    updateLanguage,
  } = useResumeEditing();
  const { personalInfo, experience, education, skills, projects, languages } =
    resumeData;

  // Fields shown in the contact grid (excluding fullName & title which render separately)
  // Only show fields that have a non-empty value
  const contactFields = personalInfoFields.filter((f) => {
    if (f === "fullName" || f === "title") return false;
    const v = personalInfo[f as keyof typeof personalInfo];
    return typeof v === "string" && v.trim() !== "";
  });

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

  const renderSection = (section: (typeof visibleSections)[0]) => {
    switch (section.type) {
      case "personal":
        return (
          <header className="mb-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {/* Name & title rendered separately — only show if has value */}
                {personalInfoFields.includes("fullName") && personalInfo.fullName && (
                  <h1 className="font-bold text-slate-900 mb-1" style={{ fontSize: "20pt" }}>
                    <EditableText
                      value={personalInfo.fullName || ""}
                      onChange={(v) => updatePersonalInfo({ fullName: v })}
                      placeholder={t.name}
                      className="font-bold"
                    />
                  </h1>
                )}
                {personalInfoFields.includes("title") && personalInfo.title && (
                  <p className="font-semibold text-slate-800 mb-3" style={{ fontSize: "13pt" }}>
                    <EditableText
                      value={personalInfo.title || ""}
                      onChange={(v) => updatePersonalInfo({ title: v })}
                      placeholder={t.title}
                      className="font-semibold text-slate-800"
                    />
                  </p>
                )}

                {/* Dynamic contact fields — 2 per row */}
                <div className="mt-2 space-y-1" style={{ fontSize: "10pt" }}>
                  {Array.from({ length: Math.ceil(contactFields.length / 2) }).map(
                    (_, rowIdx) => {
                      const left = contactFields[rowIdx * 2];
                      const right = contactFields[rowIdx * 2 + 1];
                      return (
                        <div key={rowIdx} className="flex gap-x-8">
                          {left && (
                            <div className="flex-1">
                              <span className="font-bold">{fieldLabels[left]}：</span>
                              <EditableText
                                value={
                                  (personalInfo[left as keyof typeof personalInfo] as string) || ""
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
                              <span className="font-bold">{fieldLabels[right]}：</span>
                              <EditableText
                                value={
                                  (personalInfo[right as keyof typeof personalInfo] as string) || ""
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
                    }
                  )}
                </div>
              </div>

              {personalInfo.photo && (
                <div className="flex-shrink-0 ml-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200">
                    <img
                      src={personalInfo.photo}
                      alt="Photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </header>
        );

      case "summary":
        return (
          <section className="mb-5">
            <EditableLabel
              sectionType="summary"
              defaultLabel={tEditor.summary}
              className="font-bold text-slate-900 border-b-2 border-sky-600 pb-1 block mb-3"
              style={{ fontSize: "12pt" }}
            />
            <p className="leading-relaxed" style={{ fontSize: "11pt" }}>
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

      case "experience":
        if (experience.length === 0) return null;
        return (
          <section className="mb-5">
            <EditableLabel
              sectionType="experience"
              defaultLabel={tEditor.experience}
              className="font-bold text-slate-900 border-b-2 border-sky-600 pb-1 block mb-3"
              style={{ fontSize: "12pt" }}
            />
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="flex gap-8">
                  <div className="w-40 flex-shrink-0">
                    <span
                      className="text-slate-600"
                      style={{ fontSize: "10pt" }}
                    >
                      <EditableText
                        value={`${exp.startDate} - ${exp.current ? present : exp.endDate}`}
                        onChange={(v) => {
                          const dates = v.split("-").map((s) => s.trim());
                          updateExperience(exp.id, {
                            startDate: dates[0] || "",
                            endDate: dates[1] || "",
                            current: dates[1]?.includes(present) || false,
                          });
                        }}
                        placeholder={t.startDate}
                        className="text-slate-600"
                      />
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-bold text-slate-900"
                      style={{ fontSize: "11pt" }}
                    >
                      <EditableText
                        value={exp.position}
                        onChange={(v) =>
                          updateExperience(exp.id, { position: v })
                        }
                        placeholder={t.position}
                        className="font-bold text-slate-900"
                      />
                    </h3>
                    <div
                      className="text-slate-700"
                      style={{ fontSize: "10pt" }}
                    >
                      <EditableText
                        value={exp.company}
                        onChange={(v) =>
                          updateExperience(exp.id, { company: v })
                        }
                        placeholder={t.company}
                      />
                      {exp.address && (
                        <span>
                          {" "}
                          ·{" "}
                          <EditableText
                            value={exp.address}
                            onChange={(v) =>
                              updateExperience(exp.id, { address: v })
                            }
                            placeholder={t.address}
                          />
                        </span>
                      )}
                      {exp.country && (
                        <span>
                          {" "}
                          ·{" "}
                          <EditableText
                            value={exp.country}
                            onChange={(v) =>
                              updateExperience(exp.id, { country: v })
                            }
                            placeholder={t.nationality}
                          />
                        </span>
                      )}
                      {exp.workMode && (
                        <span>
                          {" "}
                          ·{" "}
                          <EditableText
                            value={exp.workMode}
                            onChange={(v) =>
                              updateExperience(exp.id, { workMode: v })
                            }
                            placeholder="Mode"
                          />
                        </span>
                      )}
                    </div>
                    {exp.techStack && (
                      <div>
                        <span className="text-slate-500 text-xs mr-1">
                          Tech Stack:
                        </span>
                        <div className="inline-flex flex-wrap gap-1">
                          {exp.techStack.split(",").map((tech, idx) => (
                            <span
                              key={idx}
                              className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-xs"
                            >
                              {tech.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <p
                      className="mt-2 text-slate-800 whitespace-pre-line"
                      style={{ fontSize: "10pt" }}
                    >
                      <EditableText
                        value={exp.description}
                        onChange={(v) =>
                          updateExperience(exp.id, { description: v })
                        }
                        placeholder={t.description}
                        multiline
                        className="w-full"
                      />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case "education":
        if (education.length === 0) return null;
        return (
          <section className="mb-5">
            <EditableLabel
              sectionType="education"
              defaultLabel={tEditor.education}
              className="font-bold text-slate-900 border-b-2 border-sky-600 pb-1 block mb-3"
              style={{ fontSize: "12pt" }}
            />
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id}>
                  {/* Top row: 时间（左）| 专业（右） */}
                  <div className="flex justify-between items-baseline gap-4">
                    {/* 左上：时间 */}
                    <span className="text-slate-600 flex-shrink-0" style={{ fontSize: "10pt" }}>
                      <EditableText
                        value={`${edu.startDate}${edu.startDate ? " - " : ""}${edu.current ? present : edu.endDate}`}
                        onChange={(v) => {
                          const dashIdx = v.indexOf("-");
                          const s1 = dashIdx >= 0 ? v.slice(0, dashIdx).trim() : v.trim();
                          const s2 = dashIdx >= 0 ? v.slice(dashIdx + 1).trim() : "";
                          updateEducation(edu.id, {
                            startDate: s1,
                            endDate: s2,
                            current: s2.toLowerCase().includes(present.toLowerCase()),
                          });
                        }}
                        placeholder={t.startDate}
                        className="text-slate-600"
                      />
                    </span>
                    {/* 右上：专业 */}
                    <span className="text-slate-700 font-medium text-right flex-1" style={{ fontSize: "10pt" }}>
                      <EditableText
                        value={edu.field || ""}
                        onChange={(v) => updateEducation(edu.id, { field: v })}
                        placeholder={t.major}
                      />
                    </span>
                  </div>
                  {/* Bottom row: 地址（左）| 学校（右） */}
                  <div className="flex justify-between items-baseline gap-4">
                    {/* 左下：地址 */}
                    {edu.address && (
                      <span className="text-slate-500 flex-shrink-0" style={{ fontSize: "9.5pt" }}>
                        <EditableText
                          value={edu.address}
                          onChange={(v) => updateEducation(edu.id, { address: v })}
                          placeholder={t.address}
                          className="text-slate-500"
                        />
                      </span>
                    )}
                    {/* 右下：学校 */}
                    <h3 className="font-bold text-slate-900 text-right flex-1" style={{ fontSize: "11pt" }}>
                      <EditableText
                        value={edu.school || ""}
                        onChange={(v) => updateEducation(edu.id, { school: v })}
                        placeholder={t.school}
                        className="font-bold"
                      />
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case "projects":
        if (projects.length === 0) return null;
        return (
          <section className="mb-5">
            <EditableLabel
              sectionType="projects"
              defaultLabel={tEditor.projects}
              className="font-bold text-slate-900 border-b-2 border-sky-600 pb-1 block mb-3"
              style={{ fontSize: "12pt" }}
            />
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <h3
                    className="font-bold text-slate-900"
                    style={{ fontSize: "11pt" }}
                  >
                    <EditableText
                      value={proj.name}
                      onChange={(v) => updateProject(proj.id, { name: v })}
                      placeholder={t.projectName}
                      className="font-bold"
                    />
                  </h3>
                  <p
                    className="mt-1 text-slate-800 whitespace-pre-line"
                    style={{ fontSize: "10pt" }}
                  >
                    <EditableText
                      value={proj.description}
                      onChange={(v) =>
                        updateProject(proj.id, { description: v })
                      }
                      placeholder={t.description}
                      multiline
                      className="w-full"
                    />
                  </p>
                  {proj.technologies.length > 0 && (
                    <div
                      className="mt-1 text-slate-600"
                      style={{ fontSize: "10pt" }}
                    >
                      <span className="font-semibold">Tech：</span>
                      {proj.technologies.map((tech, idx) => (
                        <span key={idx}>
                          <EditableText
                            value={tech}
                            onChange={(v) => {
                              const newTechs = [...proj.technologies];
                              newTechs[idx] = v;
                              updateProject(proj.id, {
                                technologies: newTechs,
                              });
                            }}
                            placeholder={t.skills}
                          />
                          {idx < proj.technologies.length - 1 && " · "}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case "skills":
        if (skills.length === 0) return null;
        return (
          <section className="mb-5">
            <EditableLabel
              sectionType="skills"
              defaultLabel={tEditor.skills}
              className="font-bold text-slate-900 border-b-2 border-sky-600 pb-1 block mb-3"
              style={{ fontSize: "12pt" }}
            />
            <div
              className="flex flex-wrap gap-x-4 gap-y-1"
              style={{ fontSize: "11pt" }}
            >
              {skills.map((skill) => (
                <span key={skill.id}>
                  <EditableText
                    value={skill.name}
                    onChange={(v) => updateSkill(skill.id, { name: v })}
                    placeholder={!skill.name ? t.skills : ""}
                  />
                  {/* {idx < skills.length - 1 && skill.name && ", "} */}
                </span>
              ))}
            </div>
          </section>
        );

      case "languages":
        if (languages.length === 0) return null;
        return (
          <section className="mb-5">
            <EditableLabel
              sectionType="languages"
              defaultLabel={tEditor.languages}
              className="font-bold text-slate-900 border-b-2 border-sky-600 pb-1 block mb-3"
              style={{ fontSize: "12pt" }}
            />
            <div className="space-y-0.5" style={{ fontSize: "11pt" }}>
              {languages.map((lang) => (
                <div key={lang.id} className="flex items-baseline gap-2">
                  <EditableText
                    value={lang.name}
                    onChange={(v) => {
                      updateLanguage(lang.id, {
                        name: v,
                      });
                    }}
                    placeholder={t.language}
                    className="font-medium text-slate-800"
                  />
                  <EditableText
                    value={lang.level}
                    onChange={(v) => {
                      updateLanguage(lang.id, {
                        level: v,
                      });
                    }}
                    placeholder="Level"
                    className="text-slate-500"
                  />
                </div>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="bg-white font-sans"
      style={{
        padding: "80px",
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
