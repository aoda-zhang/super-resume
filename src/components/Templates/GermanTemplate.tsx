import {
  EditableText,
  EditableLabel,
  useResumeEditing,
} from "./EditableComponents";
import { useResumeStore } from "../../store/resumeStore";
import { translations } from "../../i18n";

export function GermanTemplate() {
  const language = useResumeStore((s) => s.language);
  const t = translations[language].form;
  const tEditor = translations[language].editor;
  const present = translations[language].form.current;
  const {
    resumeData,
    visibleSections,
    updatePersonalInfo,
    updateExperience,
    updateEducation,
    updateSkill,
    updateProject,
    updateLanguage,
  } = useResumeEditing();
  const { personalInfo, experience, education, skills, projects, languages } =
    resumeData;

  const renderSection = (section: (typeof visibleSections)[0]) => {
    switch (section.type) {
      case "personal":
        return (
          <header className="mb-6">
            <div className="flex justify-between items-start">
              <div className="flex-1">
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

                {personalInfo.title && (
                  <p className="text-sky-600 mb-4" style={{ fontSize: "12pt" }}>
                    <EditableText
                      value={personalInfo.title}
                      onChange={(v) => updatePersonalInfo({ title: v })}
                      placeholder={t.title}
                      className="text-sky-600"
                    />
                  </p>
                )}

                <div className="mt-3 space-y-1" style={{ fontSize: "9pt" }}>
                  {/* Row 1 */}
                  <div className="flex gap-x-8">
                    <div className="flex-1 text-slate-700">
                      <span className="font-bold">{t.address}：</span>
                      <EditableText
                        value={personalInfo.address || ""}
                        onChange={(v) => updatePersonalInfo({ address: v })}
                        placeholder={t.address}
                      />
                    </div>
                    <div className="flex-1 text-slate-700">
                      <span className="font-bold">{t.phone}：</span>
                      <EditableText
                        value={personalInfo.phone || ""}
                        onChange={(v) => updatePersonalInfo({ phone: v })}
                        placeholder={t.phone}
                      />
                    </div>
                  </div>
                  {/* Row 2 */}
                  <div className="flex gap-x-8">
                    <div className="flex-1 text-slate-700">
                      <span className="font-bold">{t.email}：</span>
                      <EditableText
                        value={personalInfo.email || ""}
                        onChange={(v) => updatePersonalInfo({ email: v })}
                        placeholder={t.email}
                      />
                    </div>
                    {/* <div className="flex-1 text-slate-700">
                      <span className="font-bold">
                        {t.dateOfBirth || "Date of Birth"}：
                      </span>
                      <EditableText
                        value={personalInfo.dateOfBirth || ""}
                        onChange={(v) => updatePersonalInfo({ dateOfBirth: v })}
                        placeholder={t.dateOfBirth || "Date of Birth"}
                      />
                    </div> */}
                  </div>
                  {/* Row 3 */}
                  <div className="flex gap-x-8">
                    <div className="flex-1 text-slate-700">
                      <span className="font-bold">{t.linkedin}：</span>
                      <EditableText
                        value={personalInfo.linkedin || ""}
                        onChange={(v) => updatePersonalInfo({ linkedin: v })}
                        placeholder={t.linkedin}
                      />
                    </div>
                    <div className="flex-1 text-slate-700">
                      <span className="font-bold">{t.nationality}：</span>
                      <EditableText
                        value={personalInfo.nationality || ""}
                        onChange={(v) => updatePersonalInfo({ nationality: v })}
                        placeholder={t.nationality}
                      />
                    </div>
                  </div>
                  {/* Row 4 */}
                  <div className="flex gap-x-8">
                    <div className="flex-1 text-slate-700">
                      <span className="font-bold">{t.website}：</span>
                      <EditableText
                        value={personalInfo.website || ""}
                        onChange={(v) => updatePersonalInfo({ website: v })}
                        placeholder={t.website}
                      />
                    </div>
                    <div className="flex-1 text-slate-700">
                      <span className="font-bold">{t.github}：</span>
                      <EditableText
                        value={personalInfo.github || ""}
                        onChange={(v) => updatePersonalInfo({ github: v })}
                        placeholder={t.github}
                      />
                    </div>
                  </div>
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
              className="font-bold text-slate-800 border-b-2 border-sky-600 pb-1 block mb-3"
              style={{ fontSize: "12pt" }}
            />
            <p
              className="text-slate-600 leading-relaxed"
              style={{ fontSize: "10pt" }}
            >
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
              className="font-bold text-slate-800 border-b-2 border-sky-600 pb-1 block mb-3"
              style={{ fontSize: "12pt" }}
            />
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="flex gap-6">
                  <div className="w-28 flex-shrink-0">
                    <span
                      className="text-slate-500"
                      style={{ fontSize: "9pt" }}
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
                        className="text-slate-500"
                      />
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3
                      className="font-semibold text-sky-600"
                      style={{ fontSize: "10.5pt" }}
                    >
                      <EditableText
                        value={exp.position}
                        onChange={(v) =>
                          updateExperience(exp.id, { position: v })
                        }
                        placeholder={t.position}
                        className="font-semibold text-sky-600"
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
                      className="mt-3 text-slate-600 whitespace-pre-line"
                      style={{ fontSize: "9.5pt" }}
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
              className="font-bold text-slate-800 border-b-2 border-sky-600 pb-1 block mb-3"
              style={{ fontSize: "12pt" }}
            />
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline gap-6">
                    {/* LEFT: time + address */}
                    <div className="flex-1">
                      <span
                        className="text-slate-500 block"
                        style={{ fontSize: "9pt" }}
                      >
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
                          className="text-slate-500"
                        />
                      </span>
                      {edu.address && (
                        <span className="text-slate-500" style={{ fontSize: "9pt" }}>
                          <EditableText
                            value={edu.address}
                            onChange={(v) => updateEducation(edu.id, { address: v })}
                            placeholder={t.address}
                            className="text-slate-500"
                          />
                        </span>
                      )}
                    </div>
                    {/* RIGHT: field + school */}
                    <div className="flex-1 text-right">
                      {(edu.degree || edu.field) && (
                        <div
                          className="text-slate-700"
                          style={{ fontSize: "10pt" }}
                        >
                          <EditableText
                            value={`${edu.degree}${edu.degree && edu.field ? " · " : ""}${edu.field}`}
                            onChange={(v) => {
                              const parts = v.split("·").map((s) => s.trim());
                              updateEducation(edu.id, {
                                degree: parts[0] || "",
                                field: parts[1] || "",
                              });
                            }}
                            placeholder={`${t.degree} · ${t.major}`}
                          />
                        </div>
                      )}
                      <h3
                        className="font-semibold text-slate-800"
                        style={{ fontSize: "10.5pt" }}
                      >
                        <EditableText
                          value={edu.school}
                          onChange={(v) => updateEducation(edu.id, { school: v })}
                          placeholder={t.school}
                          className="font-semibold"
                        />
                      </h3>
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
              className="font-bold text-slate-800 border-b-2 border-sky-600 pb-1 block mb-3"
              style={{ fontSize: "12pt" }}
            />
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <h3
                    className="font-semibold text-slate-800"
                    style={{ fontSize: "10.5pt" }}
                  >
                    <EditableText
                      value={proj.name}
                      onChange={(v) => updateProject(proj.id, { name: v })}
                      placeholder={t.projectName}
                      className="font-semibold"
                    />
                  </h3>
                  <p
                    className="mt-1 text-slate-600 whitespace-pre-line"
                    style={{ fontSize: "9.5pt" }}
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
                      className="mt-1 text-slate-500"
                      style={{ fontSize: "9pt" }}
                    >
                      <span className="font-medium">Tech：</span>
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
              className="font-bold text-slate-800 border-b-2 border-sky-600 pb-1 block mb-3"
              style={{ fontSize: "12pt" }}
            />
            <div
              className="flex flex-wrap gap-x-4 gap-y-1 text-slate-700"
              style={{ fontSize: "9.5pt" }}
            >
              {skills.map((skill) => (
                <span key={skill.id}>
                  <EditableText
                    value={skill.name}
                    onChange={(v) => updateSkill(skill.id, { name: v })}
                    placeholder={t.skills}
                  />
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
              className="font-bold text-slate-800 border-b-2 border-sky-600 pb-1 block mb-3"
              style={{ fontSize: "12pt" }}
            />
            <div className="space-y-0.5" style={{ fontSize: "9.5pt" }}>
              {languages.map((lang) => (
                <div key={lang.id} className="text-slate-700">
                  <EditableText
                    value={`${lang.name}: ${lang.level}`}
                    onChange={(v) => {
                      const colonIdx = v.indexOf(":");
                      const name = colonIdx >= 0 ? v.slice(0, colonIdx).trim() : v.trim();
                      const level = colonIdx >= 0 ? v.slice(colonIdx + 1).trim() : "";
                      updateLanguage(lang.id, { name, level });
                    }}
                    placeholder={`${t.language}: ${t.level}`}
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
        padding: "15mm",
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
