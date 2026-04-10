import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { PersonalInfoSection } from '../Sections/PersonalInfoSection';
import { ExperienceSection } from '../Sections/ExperienceSection';
import { EducationSection } from '../Sections/EducationSection';
import { SkillsSection } from '../Sections/SkillsSection';
import { ProjectsSection } from '../Sections/ProjectsSection';
import { LanguagesSection } from '../Sections/LanguagesSection';
import { FileJson, ChevronDown, ChevronRight } from 'lucide-react';

type SectionKey = 'personalInfo' | 'experience' | 'education' | 'skills' | 'projects' | 'languages';

interface Section {
  key: SectionKey;
  label: string;
  icon: string;
}

const sections: Section[] = [
  { key: 'personalInfo', label: '个人信息', icon: '👤' },
  { key: 'experience', label: '工作经历', icon: '💼' },
  { key: 'education', label: '教育背景', icon: '🎓' },
  { key: 'skills', label: '技能', icon: '🛠️' },
  { key: 'projects', label: '项目', icon: '🚀' },
  { key: 'languages', label: '语言', icon: '🌐' },
];

export function SectionEditor() {
  const { resumeData, updateResumeData } = useResumeStore();
  const [expandedSection, setExpandedSection] = useState<SectionKey>('personalInfo');
  const [showJson, setShowJson] = useState(false);

  const handleUpdate = <K extends keyof typeof resumeData>(key: K, value: typeof resumeData[K]) => {
    updateResumeData({ [key]: value });
  };

  const renderSection = (key: SectionKey) => {
    switch (key) {
      case 'personalInfo':
        return <PersonalInfoSection data={resumeData.personalInfo} onChange={(v) => handleUpdate('personalInfo', v)} />;
      case 'experience':
        return <ExperienceSection data={resumeData.experience} onChange={(v) => handleUpdate('experience', v)} />;
      case 'education':
        return <EducationSection data={resumeData.education} onChange={(v) => handleUpdate('education', v)} />;
      case 'skills':
        return <SkillsSection data={resumeData.skills} onChange={(v) => handleUpdate('skills', v)} />;
      case 'projects':
        return <ProjectsSection data={resumeData.projects} onChange={(v) => handleUpdate('projects', v)} />;
      case 'languages':
        return <LanguagesSection data={resumeData.languages} onChange={(v) => handleUpdate('languages', v)} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* 头部 */}
      <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
        <h2 className="font-semibold text-slate-700">简历内容</h2>
        <button
          onClick={() => setShowJson(!showJson)}
          className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
            showJson ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileJson className="w-4 h-4" />
          JSON
        </button>
      </div>

      {/* JSON 视图 */}
      {showJson && (
        <div className="flex-1 overflow-auto p-4">
          <textarea
            value={JSON.stringify(resumeData, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                Object.keys(parsed).forEach(key => {
                  updateResumeData({ [key]: parsed[key] });
                });
              } catch {}
            }}
            className="w-full h-full min-h-[500px] p-4 font-mono text-xs bg-slate-900 text-green-400 rounded-lg border border-slate-700 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* 章节列表 */}
      {!showJson && (
        <div className="flex-1 overflow-auto">
          <div className="divide-y divide-slate-200">
            {sections.map((section) => (
              <div key={section.key}>
                <button
                  onClick={() => setExpandedSection(expandedSection === section.key ? '' as SectionKey : section.key)}
                  className={`w-full px-4 py-3 flex items-center justify-between hover:bg-white transition-colors ${
                    expandedSection === section.key ? 'bg-white' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{section.icon}</span>
                    <span className="font-medium text-slate-700">{section.label}</span>
                  </div>
                  {expandedSection === section.key ? (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400" />
                  )}
                </button>
                {expandedSection === section.key && (
                  <div className="px-4 pb-4 bg-white">
                    {renderSection(section.key)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
