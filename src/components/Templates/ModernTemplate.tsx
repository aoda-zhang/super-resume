import { useState, useRef, useEffect } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

// 可编辑文本组件
function EditableText({
  value,
  onChange,
  className = '',
  placeholder = '',
  multiline = false,
}: {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
  multiline?: boolean;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    onChange(editValue);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditValue(value);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    const InputComponent = multiline ? 'textarea' : 'input';
    return (
      <InputComponent
        ref={inputRef as any}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`${className} bg-indigo-50 border-2 border-indigo-400 rounded px-2 py-1 outline-none resize-none`}
        rows={multiline ? 3 : undefined}
      />
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`${className} cursor-text hover:bg-indigo-50 hover:px-2 hover:py-1 hover:rounded transition-all border-2 border-transparent hover:border-indigo-200`}
      title="点击编辑"
    >
      {value || placeholder}
    </span>
  );
}

// 可编辑标签组件
function EditableLabel({
  sectionType,
  defaultLabel,
}: {
  sectionType: string;
  defaultLabel: string;
}) {
  const { sectionOrder, updateSectionLabel } = useResumeStore();
  const section = sectionOrder.find(s => s.type === sectionType);
  const label = section?.label || defaultLabel;
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(label);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditValue(label);
  }, [label]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    updateSectionLabel(sectionType, editValue);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <input
        ref={inputRef}
        value={editValue}
        onChange={(e) => setEditValue(e.target.value)}
        onBlur={handleSave}
        onKeyDown={(e) => e.key === 'Enter' && handleSave()}
        className="text-xl font-bold text-slate-800 bg-indigo-50 border-2 border-indigo-400 rounded px-2 py-1 outline-none"
      />
    );
  }

  return (
    <h2
      onClick={() => setIsEditing(true)}
      className="text-xl font-bold text-slate-800 cursor-text hover:bg-indigo-50 hover:px-2 hover:py-1 hover:rounded transition-all border-2 border-transparent hover:border-indigo-200"
      title="点击编辑标题"
    >
      {label}
    </h2>
  );
}

export function ModernTemplate() {
  const { resumeData, sectionOrder, updatePersonalInfo, updateExperience, updateEducation, updateSkill, updateProject, updateLanguage } = useResumeStore();
  const { personalInfo, experience, education, skills, projects, languages } = resumeData;

  const visibleSections = sectionOrder.filter(s => s.visible);

  const renderSection = (section: typeof sectionOrder[0]) => {
    switch (section.type) {
      case 'personal':
        return (
          <header className="border-b-2 border-indigo-600 pb-6 mb-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">
              <EditableText
                value={personalInfo.fullName}
                onChange={(v) => updatePersonalInfo({ fullName: v })}
                placeholder="姓名"
                className="text-3xl font-bold"
              />
            </h1>
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              {personalInfo.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-4 h-4" />
                  <EditableText
                    value={personalInfo.email}
                    onChange={(v) => updatePersonalInfo({ email: v })}
                    placeholder="邮箱"
                  />
                </span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  <EditableText
                    value={personalInfo.phone}
                    onChange={(v) => updatePersonalInfo({ phone: v })}
                    placeholder="电话"
                  />
                </span>
              )}
              {personalInfo.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <EditableText
                    value={personalInfo.location}
                    onChange={(v) => updatePersonalInfo({ location: v })}
                    placeholder="地址"
                  />
                </span>
              )}
              {personalInfo.website && (
                <span className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <EditableText
                    value={personalInfo.website}
                    onChange={(v) => updatePersonalInfo({ website: v })}
                    placeholder="网站"
                  />
                </span>
              )}
            </div>
          </header>
        );

      case 'summary':
        if (!personalInfo.summary) return null;
        return (
          <section className="mb-6">
            <EditableLabel sectionType="summary" defaultLabel="个人简介" />
            <div className="mt-3 text-slate-700 leading-relaxed">
              <EditableText
                value={personalInfo.summary}
                onChange={(v) => updatePersonalInfo({ summary: v })}
                placeholder="个人简介..."
                multiline
                className="w-full"
              />
            </div>
          </section>
        );

      case 'experience':
        if (experience.length === 0) return null;
        return (
          <section className="mb-6">
            <EditableLabel sectionType="experience" defaultLabel="工作经验" />
            <div className="mt-3 space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="group">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-slate-800">
                      <EditableText
                        value={exp.position}
                        onChange={(v) => updateExperience(exp.id, { position: v })}
                        placeholder="职位"
                        className="font-semibold"
                      />
                    </h3>
                    <span className="text-sm text-slate-500">
                      <EditableText
                        value={`${exp.startDate} - ${exp.current ? '至今' : exp.endDate}`}
                        onChange={(v) => {
                          const dates = v.split('-').map(s => s.trim());
                          updateExperience(exp.id, {
                            startDate: dates[0] || '',
                            endDate: dates[1] || '',
                            current: dates[1]?.includes('至今') || false,
                          });
                        }}
                        placeholder="时间"
                        className="text-sm"
                      />
                    </span>
                  </div>
                  <div className="text-slate-700 font-medium">
                    <EditableText
                      value={exp.company}
                      onChange={(v) => updateExperience(exp.id, { company: v })}
                      placeholder="公司"
                    />
                  </div>
                  <div className="mt-2 text-slate-600 text-sm whitespace-pre-line">
                    <EditableText
                      value={exp.description}
                      onChange={(v) => updateExperience(exp.id, { description: v })}
                      placeholder="工作描述..."
                      multiline
                      className="w-full"
                    />
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
            <EditableLabel sectionType="education" defaultLabel="教育背景" />
            <div className="mt-3 space-y-3">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-slate-800">
                      <EditableText
                        value={edu.degree}
                        onChange={(v) => updateEducation(edu.id, { degree: v })}
                        placeholder="学位"
                        className="font-semibold"
                      />
                    </h3>
                    <span className="text-sm text-slate-500">
                      <EditableText
                        value={`${edu.startDate} - ${edu.current ? '至今' : edu.endDate}`}
                        onChange={(v) => {
                          const dates = v.split('-').map(s => s.trim());
                          updateEducation(edu.id, {
                            startDate: dates[0] || '',
                            endDate: dates[1] || '',
                            current: dates[1]?.includes('至今') || false,
                          });
                        }}
                        placeholder="时间"
                        className="text-sm"
                      />
                    </span>
                  </div>
                  <div className="text-slate-700">
                    <EditableText
                      value={`${edu.school} · ${edu.field}`}
                      onChange={(v) => {
                        const parts = v.split('·').map(s => s.trim());
                        updateEducation(edu.id, {
                          school: parts[0] || '',
                          field: parts[1] || '',
                        });
                      }}
                      placeholder="学校 · 专业"
                    />
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
            <EditableLabel sectionType="projects" defaultLabel="项目经历" />
            <div className="mt-3 space-y-4">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-slate-800">
                      <EditableText
                        value={proj.name}
                        onChange={(v) => updateProject(proj.id, { name: v })}
                        placeholder="项目名称"
                        className="font-semibold"
                      />
                    </h3>
                    {proj.link && (
                      <a href={proj.link} className="text-sm text-indigo-600 hover:underline">
                        <EditableText
                          value={proj.link}
                          onChange={(v) => updateProject(proj.id, { link: v })}
                          placeholder="链接"
                          className="text-sm"
                        />
                      </a>
                    )}
                  </div>
                  <div className="mt-2 text-slate-600 text-sm whitespace-pre-line">
                    <EditableText
                      value={proj.description}
                      onChange={(v) => updateProject(proj.id, { description: v })}
                      placeholder="项目描述..."
                      multiline
                      className="w-full"
                    />
                  </div>
                  {proj.technologies.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {proj.technologies.map((tech, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                          <EditableText
                            value={tech}
                            onChange={(v) => {
                              const newTechs = [...proj.technologies];
                              newTechs[idx] = v;
                              updateProject(proj.id, { technologies: newTechs });
                            }}
                            placeholder="技术"
                            className="text-xs"
                          />
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
          <section className="mb-6">
            <EditableLabel sectionType="skills" defaultLabel="技能" />
            <div className="mt-3 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm"
                >
                  <EditableText
                    value={skill.name}
                    onChange={(v) => updateSkill(skill.id, { name: v })}
                    placeholder="技能"
                    className="text-sm"
                  />
                </span>
              ))}
            </div>
          </section>
        );

      case 'languages':
        if (languages.length === 0) return null;
        return (
          <section className="mb-6">
            <EditableLabel sectionType="languages" defaultLabel="语言能力" />
            <div className="mt-3 space-y-1">
              {languages.map((lang) => (
                <div key={lang.id} className="text-slate-700">
                  <EditableText
                    value={`${lang.name}: ${lang.level}`}
                    onChange={(v) => {
                      const parts = v.split(':').map(s => s.trim());
                      updateLanguage(lang.id, {
                        name: parts[0] || '',
                        level: parts[1] || '',
                      });
                    }}
                    placeholder="语言: 水平"
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
    <div className="bg-white p-8 min-h-[1123px] shadow-lg">
      {visibleSections.map((section) => (
        <div key={section.id}>{renderSection(section)}</div>
      ))}
    </div>
  );
}
