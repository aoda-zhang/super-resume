import { Mail, Phone, MapPin } from 'lucide-react';
import { EditableText, EditableLabel, useResumeEditing } from './EditableComponents';

export function ClassicTemplate() {
  const { resumeData, visibleSections, updatePersonalInfo, updateExperience, updateEducation, updateSkill, updateProject, updateLanguage } = useResumeEditing();
  const { personalInfo, experience, education, skills, projects, languages } = resumeData;

  const renderSection = (section: typeof visibleSections[0]) => {
    switch (section.type) {
      case 'personal':
        return (
          <header className="text-center border-b border-slate-800 pb-6 mb-6">
            <h1 className="text-4xl font-serif text-slate-900 mb-4">
              <EditableText
                value={personalInfo.fullName}
                onChange={(v) => updatePersonalInfo({ fullName: v })}
                placeholder="姓名"
                className="text-4xl font-serif"
              />
            </h1>
            <div className="flex justify-center flex-wrap gap-4 text-sm text-slate-600">
              {personalInfo.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <EditableText value={personalInfo.email} onChange={(v) => updatePersonalInfo({ email: v })} placeholder="邮箱" />
                </span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <EditableText value={personalInfo.phone} onChange={(v) => updatePersonalInfo({ phone: v })} placeholder="电话" />
                </span>
              )}
              {personalInfo.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <EditableText value={personalInfo.location} onChange={(v) => updatePersonalInfo({ location: v })} placeholder="地址" />
                </span>
              )}
            </div>
          </header>
        );

      case 'summary':
        if (!personalInfo.summary) return null;
        return (
          <section className="mb-6">
            <EditableLabel sectionType="summary" defaultLabel="个人简介" className="text-lg font-serif font-bold text-slate-900 border-b border-slate-300 pb-1 block mb-3" />
            <p className="text-slate-700 leading-relaxed">
              <EditableText value={personalInfo.summary} onChange={(v) => updatePersonalInfo({ summary: v })} placeholder="个人简介..." multiline className="w-full" />
            </p>
          </section>
        );

      case 'experience':
        if (experience.length === 0) return null;
        return (
          <section className="mb-6">
            <EditableLabel sectionType="experience" defaultLabel="工作经验" className="text-lg font-serif font-bold text-slate-900 border-b border-slate-300 pb-1 block mb-3" />
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-800">
                      <EditableText value={exp.position} onChange={(v) => updateExperience(exp.id, { position: v })} placeholder="职位" className="font-bold" />
                    </h3>
                    <span className="text-sm text-slate-600 italic">
                      <EditableText value={`${exp.startDate} - ${exp.current ? '至今' : exp.endDate}`} onChange={(v) => {
                        const dates = v.split('-').map(s => s.trim());
                        updateExperience(exp.id, { startDate: dates[0] || '', endDate: dates[1] || '', current: dates[1]?.includes('至今') || false });
                      }} placeholder="时间" className="text-sm italic" />
                    </span>
                  </div>
                  <div className="text-slate-700 italic">
                    <EditableText value={exp.company} onChange={(v) => updateExperience(exp.id, { company: v })} placeholder="公司" className="italic" />
                  </div>
                  <p className="mt-2 text-slate-700 text-sm whitespace-pre-line">
                    <EditableText value={exp.description} onChange={(v) => updateExperience(exp.id, { description: v })} placeholder="工作描述..." multiline className="w-full" />
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
            <EditableLabel sectionType="education" defaultLabel="教育背景" className="text-lg font-serif font-bold text-slate-900 border-b border-slate-300 pb-1 block mb-3" />
            <div className="space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-bold text-slate-800">
                      <EditableText value={edu.school} onChange={(v) => updateEducation(edu.id, { school: v })} placeholder="学校" className="font-bold" />
                    </h3>
                    <span className="text-sm text-slate-600 italic">
                      <EditableText value={`${edu.startDate} - ${edu.current ? '至今' : edu.endDate}`} onChange={(v) => {
                        const dates = v.split('-').map(s => s.trim());
                        updateEducation(edu.id, { startDate: dates[0] || '', endDate: dates[1] || '', current: dates[1]?.includes('至今') || false });
                      }} placeholder="时间" className="text-sm italic" />
                    </span>
                  </div>
                  <div className="text-slate-700">
                    <EditableText value={`${edu.degree} · ${edu.field}`} onChange={(v) => {
                      const parts = v.split('·').map(s => s.trim());
                      updateEducation(edu.id, { degree: parts[0] || '', field: parts[1] || '' });
                    }} placeholder="学位 · 专业" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        );

      case 'projects':
        if (projects.length === 0) return null;
        return (
          <section className="mb-6">
            <EditableLabel sectionType="projects" defaultLabel="项目经历" className="text-lg font-serif font-bold text-slate-900 border-b border-slate-300 pb-1 block mb-3" />
            <div className="space-y-4">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <h3 className="font-bold text-slate-800">
                    <EditableText value={proj.name} onChange={(v) => updateProject(proj.id, { name: v })} placeholder="项目名称" className="font-bold" />
                  </h3>
                  <p className="mt-2 text-slate-700 text-sm whitespace-pre-line">
                    <EditableText value={proj.description} onChange={(v) => updateProject(proj.id, { description: v })} placeholder="项目描述..." multiline className="w-full" />
                  </p>
                </div>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (skills.length === 0) return null;
        return (
          <section className="mb-6">
            <EditableLabel sectionType="skills" defaultLabel="技能" className="text-lg font-serif font-bold text-slate-900 border-b border-slate-300 pb-1 block mb-3" />
            <p className="text-slate-700">
              {skills.map((skill, idx) => (
                <span key={skill.id}>
                  <EditableText value={skill.name} onChange={(v) => updateSkill(skill.id, { name: v })} placeholder="技能" />
                  {idx < skills.length - 1 && ' · '}
                </span>
              ))}
            </p>
          </section>
        );

      case 'languages':
        if (languages.length === 0) return null;
        return (
          <section className="mb-6">
            <EditableLabel sectionType="languages" defaultLabel="语言能力" className="text-lg font-serif font-bold text-slate-900 border-b border-slate-300 pb-1 block mb-3" />
            <div className="space-y-1">
              {languages.map((lang) => (
                <div key={lang.id} className="text-slate-700">
                  <EditableText value={`${lang.name}: ${lang.level}`} onChange={(v) => {
                    const parts = v.split(':').map(s => s.trim());
                    updateLanguage(lang.id, { name: parts[0] || '', level: parts[1] || '' });
                  }} placeholder="语言: 水平" />
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
    <div className="bg-white p-10 min-h-[1123px] shadow-lg font-serif">
      {visibleSections.map((section) => (
        <div key={section.id}>{renderSection(section)}</div>
      ))}
    </div>
  );
}
