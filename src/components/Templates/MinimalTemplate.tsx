import { EditableText, EditableLabel, useResumeEditing } from './EditableComponents';

export function MinimalTemplate() {
  const { resumeData, visibleSections, updatePersonalInfo, updateExperience, updateEducation, updateSkill } = useResumeEditing();
  const { personalInfo, experience, education, skills } = resumeData;

  const renderSection = (section: typeof visibleSections[0]) => {
    switch (section.type) {
      case 'personal':
        return (
          <header className="mb-8">
            <h1 className="text-2xl font-light text-slate-900 mb-2">
              <EditableText value={personalInfo.fullName} onChange={(v) => updatePersonalInfo({ fullName: v })} placeholder="姓名" className="text-2xl font-light" />
            </h1>
            <div className="text-sm text-slate-500 space-x-3">
              <EditableText value={personalInfo.email} onChange={(v) => updatePersonalInfo({ email: v })} placeholder="邮箱" className="text-sm" />
              {personalInfo.phone && <span>·</span>}
              <EditableText value={personalInfo.phone} onChange={(v) => updatePersonalInfo({ phone: v })} placeholder="电话" className="text-sm" />
              {personalInfo.location && <span>·</span>}
              <EditableText value={personalInfo.location} onChange={(v) => updatePersonalInfo({ location: v })} placeholder="地址" className="text-sm" />
            </div>
          </header>
        );

      case 'summary':
        if (!personalInfo.summary) return null;
        return (
          <section className="mb-6">
            <p className="text-slate-600 leading-relaxed">
              <EditableText value={personalInfo.summary} onChange={(v) => updatePersonalInfo({ summary: v })} placeholder="个人简介..." multiline className="w-full" />
            </p>
          </section>
        );

      case 'experience':
        if (experience.length === 0) return null;
        return (
          <section className="mb-6">
            <EditableLabel sectionType="experience" defaultLabel="经验" className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-4" />
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-slate-900">
                      <EditableText value={exp.position} onChange={(v) => updateExperience(exp.id, { position: v })} placeholder="职位" />
                    </h3>
                    <span className="text-xs text-slate-400">
                      <EditableText value={`${exp.startDate} - ${exp.current ? '至今' : exp.endDate}`} onChange={(v) => {
                        const dates = v.split('-').map(s => s.trim());
                        updateExperience(exp.id, { startDate: dates[0] || '', endDate: dates[1] || '', current: dates[1]?.includes('至今') || false });
                      }} placeholder="时间" className="text-xs" />
                    </span>
                  </div>
                  <div className="text-sm text-slate-500">
                    <EditableText value={exp.company} onChange={(v) => updateExperience(exp.id, { company: v })} placeholder="公司" className="text-sm" />
                  </div>
                  <p className="mt-2 text-sm text-slate-600 whitespace-pre-line">
                    <EditableText value={exp.description} onChange={(v) => updateExperience(exp.id, { description: v })} placeholder="工作描述..." multiline className="w-full text-sm" />
                  </p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'education':
        if (education.length === 0) return null;
        return (
          <section className="mb-6">
            <EditableLabel sectionType="education" defaultLabel="教育" className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-4" />
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-slate-900">
                      <EditableText value={edu.school} onChange={(v) => updateEducation(edu.id, { school: v })} placeholder="学校" />
                    </h3>
                    <span className="text-xs text-slate-400">
                      <EditableText value={`${edu.startDate} - ${edu.current ? '至今' : edu.endDate}`} onChange={(v) => {
                        const dates = v.split('-').map(s => s.trim());
                        updateEducation(edu.id, { startDate: dates[0] || '', endDate: dates[1] || '', current: dates[1]?.includes('至今') || false });
                      }} placeholder="时间" className="text-xs" />
                    </span>
                  </div>
                  <div className="text-sm text-slate-500">
                    <EditableText value={`${edu.degree} · ${edu.field}`} onChange={(v) => {
                      const parts = v.split('·').map(s => s.trim());
                      updateEducation(edu.id, { degree: parts[0] || '', field: parts[1] || '' });
                    }} placeholder="学位 · 专业" className="text-sm" />
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
            <EditableLabel sectionType="skills" defaultLabel="技能" className="text-xs font-medium text-slate-400 uppercase tracking-wider block mb-4" />
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
              {skills.map((skill) => (
                <span key={skill.id}>
                  <EditableText value={skill.name} onChange={(v) => updateSkill(skill.id, { name: v })} placeholder="技能" className="text-sm" />
                </span>
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
