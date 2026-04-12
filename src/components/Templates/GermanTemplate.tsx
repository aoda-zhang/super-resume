import {
  EditableText,
  EditableLabel,
  useResumeEditing,
} from "./EditableComponents";
import { useResumeStore } from "../../store/resumeStore";
import { translations } from "../../i18n";
import type { PersonalInfoFieldType } from "../../store/resumeStore";
import CEFR_LEVELS from "../../constants/languageLevel";

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
                {personalInfoFields.includes("fullName") &&
                  personalInfo.fullName && (
                    <h1
                      className="font-bold text-slate-900 mb-1"
                      style={{ fontSize: "22pt" }}
                    >
                      <EditableText
                        value={personalInfo.fullName || ""}
                        onChange={(v) => updatePersonalInfo({ fullName: v })}
                        placeholder={t.name}
                        className="font-bold"
                      />
                    </h1>
                  )}
                {personalInfoFields.includes("title") && personalInfo.title && (
                  <p
                    className="font-semibold text-sky-500 mb-2"
                    style={{ fontSize: "15pt" }}
                  >
                    <EditableText
                      value={personalInfo.title || ""}
                      onChange={(v) => updatePersonalInfo({ title: v })}
                      placeholder={t.title}
                      className="font-semibold text-sky-500"
                    />
                  </p>
                )}

                {/* Dynamic contact fields — 2 per row */}
                <div className="mt-2 space-y-1" style={{ fontSize: "11.5pt" }}>
                  {Array.from({
                    length: Math.ceil(contactFields.length / 2),
                  }).map((_, rowIdx) => {
                    const left = contactFields[rowIdx * 2];
                    const right = contactFields[rowIdx * 2 + 1];
                    return (
                      <div key={rowIdx} className="flex gap-x-8">
                        {left && (
                          <div className="flex-1 break-words">
                            <span className="font-bold">
                              {fieldLabels[left]}：
                            </span>
                            <EditableText
                              className="inline break-words"
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
                          <div className="flex-1 break-words">
                            <span className="font-bold">
                              {fieldLabels[right]}：
                            </span>
                            <EditableText
                              className="inline break-words"
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
              className="font-bold text-slate-900 border-b border-black pb-1 block mb-1.5"
              style={{ fontSize: "14pt" }}
            />
            <p style={{ fontSize: "11.5pt", lineHeight: "1.35" }}>
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
              className="font-bold text-slate-900 border-b border-black pb-1 block mb-1.5"
              style={{ fontSize: "14pt" }}
            />
            <div className="space-y-2.5">
              {experience.map((exp) => (
                <div key={exp.id} className="flex gap-10">
                  <div className="w-36 shrink-0">
                    <span
                      className="text-slate-600 text-left block whitespace-nowrap"
                      style={{ fontSize: "11.5pt" }}
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
                      className="font-semibold text-sky-500"
                      style={{ fontSize: "13.5pt" }}
                    >
                      <EditableText
                        value={exp.position}
                        onChange={(v) =>
                          updateExperience(exp.id, { position: v })
                        }
                        placeholder={t.position}
                        className="font-semibold text-sky-500"
                      />
                    </h3>
                    <div
                      className="text-slate-700"
                      style={{ fontSize: "11.5pt" }}
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
                      className="mt-1 text-slate-800 whitespace-pre-line"
                      style={{ fontSize: "11.5pt", lineHeight: "1.35" }}
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
              className="font-bold text-slate-900 border-b border-black pb-1 block mb-1.5"
              style={{ fontSize: "14pt" }}
            />
            <div className="space-y-1">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex gap-10">
                    {/* LEFT: date + location */}
                    <div className="w-36 shrink-0">
                      <div
                        className="text-slate-600 whitespace-nowrap"
                        style={{ fontSize: "11.5pt" }}
                      >
                        <EditableText
                          value={`${edu.startDate} - ${edu.current ? present : edu.endDate}`}
                          onChange={(v) => {
                            const dates = v.split("-").map((s) => s.trim());
                            updateEducation(edu.id, {
                              startDate: dates[0] || "",
                              endDate: dates[1] || "",
                              current: dates[1]?.includes(present) || false,
                            });
                          }}
                          placeholder={t.startDate}
                        />
                      </div>
                      {(edu.address || edu.country) && (
                        <div
                          className="text-slate-500"
                          style={{ fontSize: "11.5pt" }}
                        >
                          <EditableText
                            value={`${edu.address || ""}${edu.address && edu.country ? ", " : ""}${edu.country || ""}`}
                            onChange={(v) => {
                              const parts = v.split(",").map((s) => s.trim());
                              updateEducation(edu.id, {
                                address: parts[0] || "",
                                country: parts[1] || "",
                              });
                            }}
                            placeholder={t.address}
                          />
                        </div>
                      )}
                    </div>

                    {/* RIGHT: field (major) top, school below, degree optional below school */}
                    <div className="flex-1">
                      <div>
                        {/* TOP RIGHT: field (major) */}
                        <div
                          className="font-bold text-slate-900"
                          style={{ fontSize: "13.5pt" }}
                        >
                          <EditableText
                            value={edu.field || ""}
                            onChange={(v) =>
                              updateEducation(edu.id, { field: v })
                            }
                            placeholder={t.major}
                            className="font-bold"
                          />
                        </div>
                        {/* BOTTOM RIGHT: school */}
                        <div
                          className="text-slate-700"
                          style={{ fontSize: "11.5pt" }}
                        >
                          <EditableText
                            value={edu.school}
                            onChange={(v) =>
                              updateEducation(edu.id, { school: v })
                            }
                            placeholder={t.school}
                          />
                        </div>
                        {/* OPTIONAL: degree below school if exists */}
                      </div>
                    </div>
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
              className="font-bold text-slate-900 border-b border-black pb-1 block mb-1.5"
              style={{ fontSize: "14pt" }}
            />
            <div className="space-y-1.5">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <h3
                    className="font-bold text-slate-900"
                    style={{ fontSize: "13.5pt" }}
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
                    style={{ fontSize: "11.5pt" }}
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
                      style={{ fontSize: "11.5pt" }}
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
              className="font-bold text-slate-900 border-b border-black pb-1 block mb-1.5"
              style={{ fontSize: "14pt" }}
            />
            <div
              className="flex flex-wrap gap-x-4 gap-y-1"
              style={{ fontSize: "11.5pt" }}
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
              className="font-bold text-slate-900 border-b border-black pb-1 block mb-1.5"
              style={{ fontSize: "14pt" }}
            />
            <div style={{ fontSize: "11.5pt" }}>
              <div className="flex flex-col gap-y-1">
                {languages.map((lang) => (
                  <div key={lang.id} className="flex items-center gap-2">
                    {/* language name */}
                    <EditableText
                      value={lang.name || ""}
                      onChange={(v) => updateLanguage(lang.id, { name: v })}
                      placeholder={t.language}
                      className="min-w-[20px]"
                    />

                    {/* level select */}
                    <span className="text-slate-800">
                      {(() => {
                        const selected = CEFR_LEVELS.find(
                          (l) => l.value === lang.level,
                        );
                        return selected ? selected.label : "";
                      })()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className="bg-white"
      style={{
        fontFamily:
          "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
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
