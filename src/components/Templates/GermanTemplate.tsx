import { EditableText, EditableLabel, useResumeEditing } from './EditableComponents';

// 德国简历模板 - 干净双栏布局

export function GermanTemplate() {
  const { resumeData, visibleSections, updatePersonalInfo, updateExperience, updateEducation, updateSkill, updateProject, updateLanguage } = useResumeEditing();
  const { personalInfo, experience, education, skills, projects, languages } = resumeData;

  const renderSection = (section: typeof visibleSections[0]) => {
    switch (section.type) {
      case 'personal':
        return (
          <header className="mb-6">
            <div className="flex justify-between items-start">
              {/* 左侧：姓名+职位+联系方式 */}
              <div className="flex-1">
                {/* 姓名 */}
                <h1 className="font-bold text-slate-900 mb-1" style={{ fontSize: '22pt' }}>
                  <EditableText
                    value={personalInfo.fullName || ''}
                    onChange={(v) => updatePersonalInfo({ fullName: v })}
                    placeholder="姓名"
                    className="font-bold"
                  />
                </h1>
                
                {/* 职位 */}
                {personalInfo.title && (
                  <p className="text-sky-600 mb-4" style={{ fontSize: '12pt' }}>
                    <EditableText
                      value={personalInfo.title}
                      onChange={(v) => updatePersonalInfo({ title: v })}
                      placeholder="职位"
                      className="text-sky-600"
                    />
                  </p>
                )}

                {/* 联系方式 */}
                <div className="space-y-1" style={{ fontSize: '9.5pt' }}>
                  {personalInfo.location && (
                    <div className="text-slate-600">
                      <span className="font-bold text-slate-700">地址：</span>
                      <EditableText value={personalInfo.location} onChange={(v) => updatePersonalInfo({ location: v })} placeholder="城市" />
                    </div>
                  )}
                  {personalInfo.email && (
                    <div className="text-slate-600">
                      <span className="font-bold text-slate-700">邮箱：</span>
                      <EditableText value={personalInfo.email} onChange={(v) => updatePersonalInfo({ email: v })} placeholder="邮箱" />
                    </div>
                  )}
                  {personalInfo.phone && (
                    <div className="text-slate-600">
                      <span className="font-bold text-slate-700">电话：</span>
                      <EditableText value={personalInfo.phone} onChange={(v) => updatePersonalInfo({ phone: v })} placeholder="电话" />
                    </div>
                  )}
                  {personalInfo.website && (
                    <div className="text-slate-600">
                      <span className="font-bold text-slate-700">网站：</span>
                      <EditableText value={personalInfo.website} onChange={(v) => updatePersonalInfo({ website: v })} placeholder="网站" />
                    </div>
                  )}
                  {personalInfo.linkedin && (
                    <div className="text-slate-600">
                      <span className="font-bold text-slate-700">LinkedIn：</span>
                      <EditableText value={personalInfo.linkedin} onChange={(v) => updatePersonalInfo({ linkedin: v })} placeholder="LinkedIn" />
                    </div>
                  )}
                  {personalInfo.github && (
                    <div className="text-slate-600">
                      <span className="font-bold text-slate-700">GitHub：</span>
                      <EditableText value={personalInfo.github} onChange={(v) => updatePersonalInfo({ github: v })} placeholder="GitHub" />
                    </div>
                  )}
                </div>
              </div>

              {/* 右侧：圆形头像 */}
              {personalInfo.photo && (
                <div className="flex-shrink-0 ml-6">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-slate-200">
                    <img 
                      src={personalInfo.photo} 
                      alt="头像" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </header>
        );

      case 'summary':
        if (!personalInfo.summary) return null;
        return (
          <section className="mb-5">
            <EditableLabel sectionType="summary" defaultLabel="个人简介" className="font-bold text-slate-800 border-b-2 border-sky-600 pb-1 block mb-3" style={{ fontSize: '12pt' }} />
            <p className="text-slate-600 leading-relaxed" style={{ fontSize: '10pt' }}>
              <EditableText value={personalInfo.summary} onChange={(v) => updatePersonalInfo({ summary: v })} placeholder="个人简介..." multiline className="w-full" />
            </p>
          </section>
        );

      case 'experience':
        if (experience.length === 0) return null;
        return (
          <section className="mb-5">
            <EditableLabel sectionType="experience" defaultLabel="工作经验" className="font-bold text-slate-800 border-b-2 border-sky-600 pb-1 block mb-3" style={{ fontSize: '12pt' }} />
            <div className="space-y-3">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-sky-600" style={{ fontSize: '10.5pt' }}>
                      <EditableText value={exp.position} onChange={(v) => updateExperience(exp.id, { position: v })} placeholder="职位" className="font-semibold text-sky-600" />
                    </h3>
                    <span className="text-slate-500" style={{ fontSize: '9pt' }}>
                      <EditableText value={`${exp.startDate} - ${exp.current ? '至今' : exp.endDate}`} onChange={(v) => {
                        const dates = v.split('-').map(s => s.trim());
                        updateExperience(exp.id, { startDate: dates[0] || '', endDate: dates[1] || '', current: dates[1]?.includes('至今') || false });
                      }} placeholder="时间" className="text-slate-500" />
                    </span>
                  </div>
                  <div className="text-slate-700" style={{ fontSize: '10pt' }}>
                    <EditableText value={exp.company} onChange={(v) => updateExperience(exp.id, { company: v })} placeholder="公司" />
                    {exp.location && <span> · <EditableText value={exp.location} onChange={(v) => updateExperience(exp.id, { location: v })} placeholder="地点" /></span>}
                    {exp.country && <span> · <EditableText value={exp.country} onChange={(v) => updateExperience(exp.id, { country: v })} placeholder="国籍" /></span>}
                    {exp.workMode && <span> · <EditableText value={exp.workMode} onChange={(v) => updateExperience(exp.id, { workMode: v })} placeholder="模式" /></span>}
                  </div>
                  {exp.techStack && (
                    <div className="mt-2">
                      <span className="text-slate-500 text-xs mr-1">技术栈:</span>
                      <div className="inline-flex flex-wrap gap-1">
                        {exp.techStack.split(',').map((tech, idx) => (
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
                  <p className="mt-3 text-slate-600 whitespace-pre-line" style={{ fontSize: '9.5pt' }}>
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
          <section className="mb-5">
            <EditableLabel sectionType="education" defaultLabel="教育背景" className="font-bold text-slate-800 border-b-2 border-sky-600 pb-1 block mb-3" style={{ fontSize: '12pt' }} />
            <div className="space-y-2">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-semibold text-slate-800" style={{ fontSize: '10.5pt' }}>
                      <EditableText value={edu.school} onChange={(v) => updateEducation(edu.id, { school: v })} placeholder="学校" className="font-semibold" />
                    </h3>
                    <span className="text-slate-500" style={{ fontSize: '9pt' }}>
                      <EditableText value={`${edu.startDate} - ${edu.current ? '至今' : edu.endDate}`} onChange={(v) => {
                        const dates = v.split('-').map(s => s.trim());
                        updateEducation(edu.id, { startDate: dates[0] || '', endDate: dates[1] || '', current: dates[1]?.includes('至今') || false });
                      }} placeholder="时间" className="text-slate-500" />
                    </span>
                  </div>
                  <div className="text-slate-700" style={{ fontSize: '10pt' }}>
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
          <section className="mb-5">
            <EditableLabel sectionType="projects" defaultLabel="项目经历" className="font-bold text-slate-800 border-b-2 border-sky-600 pb-1 block mb-3" style={{ fontSize: '12pt' }} />
            <div className="space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <h3 className="font-semibold text-slate-800" style={{ fontSize: '10.5pt' }}>
                    <EditableText value={proj.name} onChange={(v) => updateProject(proj.id, { name: v })} placeholder="项目名称" className="font-semibold" />
                  </h3>
                  <p className="mt-1 text-slate-600 whitespace-pre-line" style={{ fontSize: '9.5pt' }}>
                    <EditableText value={proj.description} onChange={(v) => updateProject(proj.id, { description: v })} placeholder="项目描述..." multiline className="w-full" />
                  </p>
                  {proj.technologies.length > 0 && (
                    <div className="mt-1 text-slate-500" style={{ fontSize: '9pt' }}>
                      <span className="font-medium">技术：</span>
                      {proj.technologies.map((tech, idx) => (
                        <span key={idx}>
                          <EditableText
                            value={tech}
                            onChange={(v) => {
                              const newTechs = [...proj.technologies];
                              newTechs[idx] = v;
                              updateProject(proj.id, { technologies: newTechs });
                            }}
                            placeholder="技术"
                          />
                          {idx < proj.technologies.length - 1 && ' · '}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (skills.length === 0) return null;
        return (
          <section className="mb-5">
            <EditableLabel sectionType="skills" defaultLabel="技能" className="font-bold text-slate-800 border-b-2 border-sky-600 pb-1 block mb-3" style={{ fontSize: '12pt' }} />
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-700" style={{ fontSize: '9.5pt' }}>
              {skills.map((skill) => (
                <span key={skill.id}>
                  <EditableText value={skill.name} onChange={(v) => updateSkill(skill.id, { name: v })} placeholder="技能" />
                </span>
              ))}
            </div>
          </section>
        );

      case 'languages':
        if (languages.length === 0) return null;
        return (
          <section className="mb-5">
            <EditableLabel sectionType="languages" defaultLabel="语言能力" className="font-bold text-slate-800 border-b-2 border-sky-600 pb-1 block mb-3" style={{ fontSize: '12pt' }} />
            <div className="space-y-0.5" style={{ fontSize: '9.5pt' }}>
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
    <div
      className="bg-white font-sans"
      style={{ padding: '15mm', minHeight: '297mm', boxSizing: 'border-box', width: '100%' }}
    >
      {visibleSections.map((section) => (
        <div key={section.id}>{renderSection(section)}</div>
      ))}
    </div>
  );
}
