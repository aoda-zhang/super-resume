import { useState, useRef, useEffect } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

// 可Edit文本组件
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
      title="点击Edit"
    >
      {value || placeholder}
    </span>
  );
}

// 可Edit标签组件
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
        className="font-bold text-slate-800 bg-indigo-50 border-2 border-indigo-400 rounded px-2 py-1 outline-none"
        style={{ fontSize: '12pt' }}
      />
    );
  }

  return (
    <h2
      onClick={() => setIsEditing(true)}
      className="font-bold text-slate-800 cursor-text hover:bg-indigo-50 hover:px-2 hover:py-1 hover:rounded transition-all border-2 border-transparent hover:border-indigo-200"
      style={{ fontSize: '12pt' }}
      title="点击Edit标题"
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
          <header className="border-b-2 border-indigo-600 pb-4 mb-5">
            <h1 className="font-bold text-slate-900 mb-3" style={{ fontSize: '20pt' }}>
              <EditableText
                value={personalInfo.fullName}
                onChange={(v) => updatePersonalInfo({ fullName: v })}
                placeholder="Name"
                className="font-bold"
              />
            </h1>
            <div className="flex flex-wrap gap-4 text-slate-600" style={{ fontSize: '9.5pt' }}>
              {personalInfo.email && (
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  <EditableText
                    value={personalInfo.email}
                    onChange={(v) => updatePersonalInfo({ email: v })}
                    placeholder="Email"
                  />
                </span>
              )}
              {personalInfo.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5" />
                  <EditableText
                    value={personalInfo.phone}
                    onChange={(v) => updatePersonalInfo({ phone: v })}
                    placeholder="Phone"
                  />
                </span>
              )}
              {personalInfo.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <EditableText
                    value={personalInfo.location}
                    onChange={(v) => updatePersonalInfo({ location: v })}
                    placeholder="Location"
                  />
                </span>
              )}
              {personalInfo.website && (
                <span className="flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  <EditableText
                    value={personalInfo.website}
                    onChange={(v) => updatePersonalInfo({ website: v })}
                    placeholder="Website"
                  />
                </span>
              )}
            </div>
          </header>
        );

      case 'summary':
        if (!personalInfo.summary) return null;
        return (
          <section className="mb-5">
            <EditableLabel sectionType="summary" defaultLabel="Summary" />
            <div className="mt-2 text-slate-700 leading-relaxed" style={{ fontSize: '10pt' }}>
              <EditableText
                value={personalInfo.summary}
                onChange={(v) => updatePersonalInfo({ summary: v })}
                placeholder="Summary..."
                multiline
                className="w-full"
              />
            </div>
          </section>
        );

      case 'experience':
        if (experience.length === 0) return null;
        return (
          <section className="mb-5">
            <EditableLabel sectionType="experience" defaultLabel="Experience" />
            <div className="mt-2 space-y-3">
              {experience.map((exp) => (
                <div key={exp.id} className="group">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-slate-800" style={{ fontSize: '10.5pt' }}>
                      <EditableText
                        value={exp.position}
                        onChange={(v) => updateExperience(exp.id, { position: v })}
                        placeholder="Title"
                        className="font-semibold"
                      />
                    </h3>
                    <span className="text-slate-500" style={{ fontSize: '9pt' }}>
                      <EditableText
                        value={`${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}`}
                        onChange={(v) => {
                          const dates = v.split('-').map(s => s.trim());
                          updateExperience(exp.id, {
                            startDate: dates[0] || '',
                            endDate: dates[1] || '',
                            current: dates[1]?.includes('Present') || false,
                          });
                        }}
                        placeholder="时间"
                        className="text-slate-500"
                      />
                    </span>
                  </div>
                  <div className="text-slate-700 font-medium" style={{ fontSize: '10pt' }}>
                    <EditableText
                      value={exp.company}
                      onChange={(v) => updateExperience(exp.id, { company: v })}
                      placeholder="Company"
                    />
                  </div>
                  {exp.techStack && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      {exp.techStack.split(',').map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded text-xs"
                        >
                          {tech.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                  <div className="mt-1 text-slate-600 whitespace-pre-line" style={{ fontSize: '9.5pt' }}>
                    <EditableText
                      value={exp.description}
                      onChange={(v) => updateExperience(exp.id, { description: v })}
                      placeholder="工作Description..."
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
          <section className="mb-5">
            <EditableLabel sectionType="education" defaultLabel="Education" />
            <div className="mt-2 space-y-2">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-slate-800" style={{ fontSize: '10.5pt' }}>
                      <EditableText
                        value={edu.degree}
                        onChange={(v) => updateEducation(edu.id, { degree: v })}
                        placeholder="Degree"
                        className="font-semibold"
                      />
                    </h3>
                    <span className="text-slate-500" style={{ fontSize: '9pt' }}>
                      <EditableText
                        value={`${edu.startDate} - ${edu.current ? 'Present' : edu.endDate}`}
                        onChange={(v) => {
                          const dates = v.split('-').map(s => s.trim());
                          updateEducation(edu.id, {
                            startDate: dates[0] || '',
                            endDate: dates[1] || '',
                            current: dates[1]?.includes('Present') || false,
                          });
                        }}
                        placeholder="时间"
                        className="text-slate-500"
                      />
                    </span>
                  </div>
                  <div className="text-slate-700" style={{ fontSize: '10pt' }}>
                    <EditableText
                      value={`${edu.school} · ${edu.field}`}
                      onChange={(v) => {
                        const parts = v.split('·').map(s => s.trim());
                        updateEducation(edu.id, {
                          school: parts[0] || '',
                          field: parts[1] || '',
                        });
                      }}
                      placeholder="School · Field"
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
          <section className="mb-5">
            <EditableLabel sectionType="projects" defaultLabel="Projects经历" />
            <div className="mt-2 space-y-3">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-slate-800" style={{ fontSize: '10.5pt' }}>
                      <EditableText
                        value={proj.name}
                        onChange={(v) => updateProject(proj.id, { name: v })}
                        placeholder="Projects名称"
                        className="font-semibold"
                      />
                    </h3>
                    {proj.link && (
                      <a href={proj.link} className="text-indigo-600 hover:underline" style={{ fontSize: '9pt' }}>
                        <EditableText
                          value={proj.link}
                          onChange={(v) => updateProject(proj.id, { link: v })}
                          placeholder="Link"
                          className="text-indigo-600"
                        />
                      </a>
                    )}
                  </div>
                  <div className="mt-1 text-slate-600 whitespace-pre-line" style={{ fontSize: '9.5pt' }}>
                    <EditableText
                      value={proj.description}
                      onChange={(v) => updateProject(proj.id, { description: v })}
                      placeholder="ProjectsDescription..."
                      multiline
                      className="w-full"
                    />
                  </div>
                  {proj.technologies.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1.5">
                      {proj.technologies.map((tech, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded" style={{ fontSize: '8.5pt' }}>
                          <EditableText
                            value={tech}
                            onChange={(v) => {
                              const newTechs = [...proj.technologies];
                              newTechs[idx] = v;
                              updateProject(proj.id, { technologies: newTechs });
                            }}
                            placeholder="技术"
                            className="text-slate-600"
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
          <section className="mb-5">
            <EditableLabel sectionType="skills" defaultLabel="Skills" />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {skills.map((skill) => (
                <span
                  key={skill.id}
                  className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-full"
                  style={{ fontSize: '9pt' }}
                >
                  <EditableText
                    value={skill.name}
                    onChange={(v) => updateSkill(skill.id, { name: v })}
                    placeholder="Skills"
                    className="text-indigo-700"
                  />
                </span>
              ))}
            </div>
          </section>
        );

      case 'languages':
        if (languages.length === 0) return null;
        return (
          <section className="mb-5">
            <EditableLabel sectionType="languages" defaultLabel="Languages能力" />
            <div className="mt-2 space-y-0.5">
              {languages.map((lang) => (
                <div key={lang.id} className="text-slate-700" style={{ fontSize: '9.5pt' }}>
                  <EditableText
                    value={`${lang.name}: ${lang.level}`}
                    onChange={(v) => {
                      const parts = v.split(':').map(s => s.trim());
                      updateLanguage(lang.id, {
                        name: parts[0] || '',
                        level: parts[1] || '',
                      });
                    }}
                    placeholder="Languages: Level"
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
      className="bg-white shadow-lg"
      style={{ padding: '15mm', minHeight: '297mm', boxSizing: 'border-box', width: '100%' }}
    >
      {visibleSections.map((section) => (
        <div key={section.id}>{renderSection(section)}</div>
      ))}
    </div>
  );
}
