import { EditableText, EditableLabel, useResumeEditing } from './EditableComponents';

// 德国简历 - 单栏自然流动布局
// 内容自然溢出到下一页，不强制分页

function formatDate(start: string, end: string, current: boolean): string {
  if (!start && !end && !current) return '';
  const endText = current ? 'Jetzt' : end || '';
  if (!start) return endText;
  if (!endText) return start;
  return `${start} – ${endText}`;
}

export function GermanTemplate() {
  const { resumeData } = useResumeEditing();
  const { personalInfo, experience, education, projects, skills, languages } = resumeData;

  return (
    <div className="bg-white font-sans p-8" data-resume-preview>
      {/* === 顶部：姓名+照片+联系方式 === */}
      <div className="flex items-start gap-6 mb-6">
        {/* 左侧：姓名+联系方式 */}
        <div className="flex-1">
          <EditableText
            value={personalInfo.fullName}
            onChange={() => {}}
            placeholder="姓名"
            className="text-3xl font-bold text-slate-900 mb-1"
          />
          {personalInfo.location && (
            <EditableText
              value={personalInfo.location}
              onChange={() => {}}
              placeholder="城市"
              className="text-sm text-slate-500 mb-4"
            />
          )}

          {/* 联系方式 - 横向排列 */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600">
            {personalInfo.email && <span>✉ <EditableText value={personalInfo.email} onChange={() => {}} placeholder="E-Mail" /></span>}
            {personalInfo.phone && <span>☎ <EditableText value={personalInfo.phone} onChange={() => {}} placeholder="电话" /></span>}
            {personalInfo.linkedin && <span>🔗 <EditableText value={personalInfo.linkedin} onChange={() => {}} placeholder="LinkedIn" /></span>}
            {personalInfo.github && <span>⌥ <EditableText value={personalInfo.github} onChange={() => {}} placeholder="GitHub" /></span>}
            {personalInfo.website && <span>⊛ <EditableText value={personalInfo.website} onChange={() => {}} placeholder="网站" /></span>}
          </div>
        </div>

        {/* 右侧：照片 */}
        <div className="flex-shrink-0">
          {personalInfo.photo ? (
            <div className="w-[90px] h-[110px] overflow-hidden border border-slate-200">
              <img src={personalInfo.photo} alt="Photo" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-[90px] h-[110px] bg-slate-100 border border-slate-200 flex items-center justify-center">
              <span className="text-3xl text-slate-300">{personalInfo.fullName?.[0] || '?'}</span>
            </div>
          )}
        </div>
      </div>

      {/* === 个人简介 === */}
      {personalInfo.summary && (
        <section className="mb-5">
          <EditableLabel sectionType="summary" defaultLabel="PROFIL" className="text-xs font-bold text-slate-900 border-b border-slate-300 pb-0.5 mb-3 block" />
          <EditableText value={personalInfo.summary} onChange={() => {}} multiline placeholder="个人简介..." className="text-xs text-slate-700 leading-relaxed" />
        </section>
      )}

      {/* === 工作经历 === */}
      {experience.length > 0 && (
        <section className="mb-5">
          <EditableLabel sectionType="experience" defaultLabel="BERUFSERFAHRUNG" className="text-xs font-bold text-slate-900 border-b border-slate-300 pb-0.5 mb-3 block" />
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="flex gap-3">
                <div className="w-20 flex-shrink-0 pt-0.5">
                  <EditableText value={formatDate(exp.startDate, exp.endDate, exp.current)} onChange={() => {}} placeholder="时间" className="text-[10px] text-slate-400 leading-tight" />
                </div>
                <div className="flex-1">
                  <h3 className="text-xs font-semibold text-slate-900 mb-0.5">
                    <EditableText value={exp.position} onChange={() => {}} placeholder="职位" />
                  </h3>
                  <div className="flex items-center gap-1.5 mb-1">
                    <EditableText value={exp.company} onChange={() => {}} placeholder="公司" className="text-[10px] text-slate-600" />
                    {exp.location && <span className="text-[10px] text-slate-400">· <EditableText value={exp.location} onChange={() => {}} placeholder="地点" /></span>}
                  </div>
                  {exp.techStack && <div className="mb-1"><EditableText value={exp.techStack} onChange={() => {}} placeholder="技术栈" className="text-[10px] text-slate-400 italic" /></div>}
                  <EditableText value={exp.description} onChange={() => {}} multiline placeholder="工作描述..." className="text-[10px] text-slate-600 leading-relaxed whitespace-pre-line" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* === 项目经历 === */}
      {projects.length > 0 && (
        <section className="mb-5">
          <EditableLabel sectionType="projects" defaultLabel="PROJEKTE" className="text-xs font-bold text-slate-900 border-b border-slate-300 pb-0.5 mb-3 block" />
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="flex gap-3">
                <div className="w-20 flex-shrink-0 pt-0.5">
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-[9px] text-slate-400 leading-tight">{proj.technologies.slice(0, 2).join(', ')}</div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-0.5">
                    <h3 className="text-[10px] font-semibold text-slate-900">
                      <EditableText value={proj.name} onChange={() => {}} placeholder="项目名称" />
                    </h3>
                    {proj.link && <EditableText value={proj.link} onChange={() => {}} placeholder="链接" className="text-[9px] text-slate-400 ml-2" />}
                  </div>
                  <EditableText value={proj.description} onChange={() => {}} multiline placeholder="项目描述..." className="text-[10px] text-slate-600 leading-relaxed" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* === 教育背景 === */}
      {education.length > 0 && (
        <section className="mb-5">
          <EditableLabel sectionType="education" defaultLabel="AUSBILDUNG" className="text-xs font-bold text-slate-900 border-b border-slate-300 pb-0.5 mb-3 block" />
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex gap-3">
                <div className="w-20 flex-shrink-0 pt-0.5">
                  <EditableText value={formatDate(edu.startDate, edu.endDate, edu.current)} onChange={() => {}} placeholder="时间" className="text-[10px] text-slate-400 leading-tight" />
                </div>
                <div className="flex-1">
                  <h3 className="text-[10px] font-semibold text-slate-900 mb-0.5">
                    <EditableText value={edu.school} onChange={() => {}} placeholder="学校" />
                  </h3>
                  {(edu.degree || edu.field) && (
                    <p className="text-[10px] text-slate-600">
                      <EditableText value={edu.degree} onChange={() => {}} placeholder="学位" />
                      {edu.degree && edu.field && ' · '}
                      <EditableText value={edu.field} onChange={() => {}} placeholder="专业" />
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* === 技能 === */}
      {skills.length > 0 && (
        <section className="mb-5">
          <EditableLabel sectionType="skills" defaultLabel="FÄHIGKEITEN" className="text-xs font-bold text-slate-900 border-b border-slate-300 pb-0.5 mb-3 block" />
          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-2">
                <EditableText value={skill.name} onChange={() => {}} placeholder="技能" className="text-[10px] text-slate-700" />
                <div className="flex gap-px ml-auto">
                  {[1, 2, 3, 4].map((l) => (
                    <div
                      key={l}
                      className={`w-1.5 h-2 rounded-sm ${
                        (skill.level === 'expert' && l <= 4) ||
                        (skill.level === 'advanced' && l <= 3) ||
                        (skill.level === 'intermediate' && l <= 2) ||
                        (skill.level === 'beginner' && l <= 1)
                          ? 'bg-slate-700'
                          : 'bg-slate-200'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* === 语言 === */}
      {languages.length > 0 && (
        <section className="mb-5">
          <EditableLabel sectionType="languages" defaultLabel="SPRACHEN" className="text-xs font-bold text-slate-900 border-b border-slate-300 pb-0.5 mb-3 block" />
          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            {languages.map((lang) => (
              <div key={lang.id} className="flex justify-between">
                <EditableText value={lang.name} onChange={() => {}} placeholder="语言" className="text-[10px] text-slate-700" />
                <EditableText value={lang.level} onChange={() => {}} placeholder="水平" className="text-[10px] text-slate-400" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
