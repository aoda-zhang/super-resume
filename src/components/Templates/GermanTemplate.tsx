import { EditableText, EditableLabel, useResumeEditing } from './EditableComponents';

export function GermanTemplate() {
  const { resumeData, visibleSections, updatePersonalInfo, updateExperience, updateEducation, updateSkill, updateLanguage } = useResumeEditing();
  const { personalInfo, experience, education, skills, languages } = resumeData;

  const renderSection = (section: typeof visibleSections[0]) => {
    switch (section.type) {
      case 'personal':
        return (
          <header className="mb-8">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 mb-4">
                  <EditableText value={personalInfo.fullName} onChange={(v) => updatePersonalInfo({ fullName: v })} placeholder="姓名" className="text-3xl font-bold" />
                </h1>
                {personalInfo.summary && (
                  <p className="text-slate-600 text-sm leading-relaxed">
                    <EditableText value={personalInfo.summary} onChange={(v) => updatePersonalInfo({ summary: v })} placeholder="个人简介..." multiline className="w-full text-sm" />
                  </p>
                )}
              </div>
              <div className="text-sm text-slate-600 space-y-1">
                <div>
                  <span className="text-slate-400">地址: </span>
                  <EditableText value={personalInfo.location} onChange={(v) => updatePersonalInfo({ location: v })} placeholder="地址" />
                </div>
                <div>
                  <span className="text-slate-400">电话: </span>
                  <EditableText value={personalInfo.phone} onChange={(v) => updatePersonalInfo({ phone: v })} placeholder="电话" />
                </div>
                <div>
                  <span className="text-slate-400">邮箱: </span>
                  <EditableText value={personalInfo.email} onChange={(v) => updatePersonalInfo({ email: v })} placeholder="邮箱" />
                </div>
                {personalInfo.linkedin && (
                  <div>
                    <span className="text-slate-400">LinkedIn: </span>
                    <EditableText value={personalInfo.linkedin} onChange={(v) => updatePersonalInfo({ linkedin: v })} placeholder="LinkedIn" />
                  </div>
                )}
              </div>
            </div>
          </header>
        );

      case 'experience':
        if (experience.length === 0) return null;
        return (
          <section className="mb-6">
            <EditableLabel sectionType="experience" defaultLabel="BERUFSERFAHRUNG" className="text-sm font-bold text-slate-900 border-b-2 border-slate-900 pb-1 block mb-4" />
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="grid grid-cols-4 gap-4">
                  <div className="text-sm text-slate-500">
                    <EditableText value={`${exp.startDate} - ${exp.current ? 'heute' : exp.endDate}`} onChange={(v) => {
                      const dates = v.split('-').map(s => s.trim());
                      updateExperience(exp.id, { startDate: dates[0] || '', endDate: dates[1] || '', current: dates[1]?.includes('heute') || dates[1]?.includes('至今') || false });
                    }} placeholder="时间" className="text-sm" />
                  </div>
                  <div className="col-span-3">
                    <h3 className="font-bold text-slate-800">
                      <EditableText value={exp.position} onChange={(v) => updateExperience(exp.id, { position: v })} placeholder="职位" className="font-bold" />
                    </h3>
                    <div className="text-slate-600">
                      <EditableText value={exp.company} onChange={(v) => updateExperience(exp.id, { company: v })} placeholder="公司" />
                    </div>
                    <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">
                      <EditableText value={exp.description} onChange={(v) => updateExperience(exp.id, { description: v })} placeholder="工作描述..." multiline className="w-full text-sm" />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'education':
        if (education.length === 0) return null;
        return (
          <section className="mb-6">
            <EditableLabel sectionType="education" defaultLabel="AUSBILDUNG" className="text-sm font-bold text-slate-900 border-b-2 border-slate-900 pb-1 block mb-4" />
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id} className="grid grid-cols-4 gap-4">
                  <div className="text-sm text-slate-500">
                    <EditableText value={`${edu.startDate} - ${edu.current ? 'heute' : edu.endDate}`} onChange={(v) => {
                      const dates = v.split('-').map(s => s.trim());
                      updateEducation(edu.id, { startDate: dates[0] || '', endDate: dates[1] || '', current: dates[1]?.includes('heute') || dates[1]?.includes('至今') || false });
                    }} placeholder="时间" className="text-sm" />
                  </div>
                  <div className="col-span-3">
                    <h3 className="font-bold text-slate-800">
                      <EditableText value={edu.school} onChange={(v) => updateEducation(edu.id, { school: v })} placeholder="学校" className="font-bold" />
                    </h3>
                    <div className="text-slate-600">
                      <EditableText value={`${edu.degree} · ${edu.field}`} onChange={(v) => {
                        const parts = v.split('·').map(s => s.trim());
                        updateEducation(edu.id, { degree: parts[0] || '', field: parts[1] || '' });
                      }} placeholder="学位 · 专业" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (skills.length === 0) return null;
        return (
          <section className="mb-6">
            <EditableLabel sectionType="skills" defaultLabel="FÄHIGKEITEN" className="text-sm font-bold text-slate-900 border-b-2 border-slate-900 pb-1 block mb-4" />
            <div className="grid grid-cols-2 gap-2">
              {skills.map((skill) => (
                <div key={skill.id} className="text-slate-700">
                  <EditableText value={skill.name} onChange={(v) => updateSkill(skill.id, { name: v })} placeholder="技能" />
                </div>
              ))}
            </div>
          </section>
        );

      case 'languages':
        if (languages.length === 0) return null;
        return (
          <section className="mb-6">
            <EditableLabel sectionType="languages" defaultLabel="SPRACHEN" className="text-sm font-bold text-slate-900 border-b-2 border-slate-900 pb-1 block mb-4" />
            <div className="space-y-1">
              {languages.map((lang) => (
                <div key={lang.id} className="grid grid-cols-2 text-slate-700">
                  <EditableText value={lang.name} onChange={(v) => updateLanguage(lang.id, { name: v })} placeholder="语言" />
                  <EditableText value={lang.level} onChange={(v) => updateLanguage(lang.id, { level: v })} placeholder="水平" />
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
    <div className="bg-white p-10 min-h-[297mm] shadow-lg">
      {visibleSections.map((section) => (
        <div key={section.id}>{renderSection(section)}</div>
      ))}
    </div>
  );
}
