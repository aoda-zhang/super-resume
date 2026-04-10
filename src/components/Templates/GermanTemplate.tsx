import { EditableText, EditableLabel, useResumeEditing } from './EditableComponents';
import type { ResumeData } from '../../types/resume';

// 德国简历 - 标准 Lebel/CV 格式
// Page 1: 左侧窄列(个人/联系/技能) + 右侧宽列(简介/经历)
// Page 2: 延续布局，全部内容
// 风格：纯白背景，藏青色标题，细线分隔

function formatDate(start: string, end: string, current: boolean): string {
  if (!start && !end && !current) return '';
  const endText = current ? 'Jetzt' : end || '';
  if (!start) return endText;
  if (!endText) return start;
  return `${start} – ${endText}`;
}

// 分割数据：第1页放前3条工作经历，第2页放剩余内容
function splitContent(data: ResumeData) {
  const page1Experience = data.experience.slice(0, 3);
  const page2Experience = data.experience.slice(3);
  return { page1Experience, page2Experience };
}

// ============ 左侧窄列 (Page 1 & 2 共用) ============
function LeftColumn({ data }: { data: ResumeData }) {
  const { personalInfo, skills, languages } = data;

  return (
    <div className="w-[200px] flex-shrink-0 pr-5">
      {/* 姓名 */}
      <div className="mb-6">
        <EditableText
          value={personalInfo.fullName}
          onChange={() => {}}
          placeholder="姓名"
          className="text-xl font-bold text-[#1a365d] leading-tight mb-1"
        />
        {personalInfo.location && (
          <EditableText
            value={personalInfo.location}
            onChange={() => {}}
            placeholder="城市"
            className="text-xs text-[#718096] mt-1"
          />
        )}
        {personalInfo.nationality && (
          <EditableText
            value={personalInfo.nationality}
            onChange={() => {}}
            placeholder="国籍"
            className="text-xs text-[#a0aec0]"
          />
        )}
      </div>

      {/* 联系方式 */}
      <div className="mb-6">
        <EditableLabel
          sectionType="personal"
          defaultLabel="KONTAKT"
          className="text-[10px] font-bold text-[#1a365d] uppercase tracking-widest mb-3 block border-b border-[#1a365d] pb-1"
        />
        <div className="space-y-2">
          {personalInfo.email && (
            <div className="flex items-start gap-1.5">
              <span className="text-[#a0aec0] text-[10px] mt-0.5 flex-shrink-0">✉</span>
              <EditableText value={personalInfo.email} onChange={() => {}} placeholder="E-Mail" className="text-[10px] text-[#4a5568] break-all leading-tight" />
            </div>
          )}
          {personalInfo.phone && (
            <div className="flex items-start gap-1.5">
              <span className="text-[#a0aec0] text-[10px] mt-0.5 flex-shrink-0">☎</span>
              <EditableText value={personalInfo.phone} onChange={() => {}} placeholder="Telefon" className="text-[10px] text-[#4a5568] leading-tight" />
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-start gap-1.5">
              <span className="text-[#a0aec0] text-[10px] mt-0.5 flex-shrink-0">⌖</span>
              <EditableText value={personalInfo.location} onChange={() => {}} placeholder="Adresse" className="text-[10px] text-[#4a5568] leading-tight" />
            </div>
          )}
          {personalInfo.linkedin && (
            <div className="flex items-start gap-1.5">
              <span className="text-[#a0aec0] text-[10px] mt-0.5 flex-shrink-0">🔗</span>
              <EditableText value={personalInfo.linkedin} onChange={() => {}} placeholder="LinkedIn" className="text-[10px] text-[#4a5568] break-all leading-tight" />
            </div>
          )}
          {personalInfo.github && (
            <div className="flex items-start gap-1.5">
              <span className="text-[#a0aec0] text-[10px] mt-0.5 flex-shrink-0">⌥</span>
              <EditableText value={personalInfo.github} onChange={() => {}} placeholder="GitHub" className="text-[10px] text-[#4a5568] break-all leading-tight" />
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-start gap-1.5">
              <span className="text-[#a0aec0] text-[10px] mt-0.5 flex-shrink-0">⊛</span>
              <EditableText value={personalInfo.website} onChange={() => {}} placeholder="Web" className="text-[10px] text-[#4a5568] break-all leading-tight" />
            </div>
          )}
        </div>
      </div>

      {/* 专业技能 */}
      {skills.length > 0 && (
        <div className="mb-6">
          <EditableLabel
            sectionType="skills"
            defaultLabel="FÄHIGKEITEN"
            className="text-[10px] font-bold text-[#1a365d] uppercase tracking-widest mb-3 block border-b border-[#1a365d] pb-1"
          />
          <div className="space-y-2">
            {skills.map((skill) => (
              <div key={skill.id} className="flex items-center gap-2">
                <div className="flex-1">
                  <EditableText value={skill.name} onChange={() => {}} placeholder="技能" className="text-[10px] text-[#2d3748]" />
                </div>
                <div className="flex gap-px">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`w-1 h-2 rounded-sm ${
                        (skill.level === 'expert' && level <= 4) ||
                        (skill.level === 'advanced' && level <= 3) ||
                        (skill.level === 'intermediate' && level <= 2) ||
                        (skill.level === 'beginner' && level <= 1)
                          ? 'bg-[#1a365d]'
                          : 'bg-[#e2e8f0]'
                      }`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 语言能力 */}
      {languages.length > 0 && (
        <div className="mb-6">
          <EditableLabel
            sectionType="languages"
            defaultLabel="SPRACHEN"
            className="text-[10px] font-bold text-[#1a365d] uppercase tracking-widest mb-3 block border-b border-[#1a365d] pb-1"
          />
          <div className="space-y-2">
            {languages.map((lang) => (
              <div key={lang.id} className="flex items-center justify-between">
                <EditableText value={lang.name} onChange={() => {}} placeholder="Sprache" className="text-[10px] text-[#2d3748]" />
                <EditableText value={lang.level} onChange={() => {}} placeholder="Niveau" className="text-[10px] text-[#a0aec0]" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 兴趣爱好 */}
      {personalInfo.interests && (
        <div className="mb-6">
          <span className="text-[10px] font-bold text-[#1a365d] uppercase tracking-widest mb-3 block border-b border-[#1a365d] pb-1">
            INTERESSEN
          </span>
          <EditableText
            value={personalInfo.interests}
            onChange={() => {}}
            multiline
            placeholder="Interessen..."
            className="text-[10px] text-[#718096] leading-relaxed"
          />
        </div>
      )}
    </div>
  );
}

// ============ 右侧宽列 - 内容 ============
function RightColumn({
  data,
  experience,
  showExperienceTitle = true,
}: {
  data: ResumeData;
  experience: ResumeData['experience'];
  showExperienceTitle?: boolean;
}) {
  const { personalInfo, education, projects } = data;

  return (
    <div className="flex-1 pl-5 border-l border-[#e2e8f0]">
      {/* 个人简介 */}
      {personalInfo.summary && (
        <section className="mb-5">
          <EditableLabel
            sectionType="summary"
            defaultLabel="PROFIL"
            className="text-[10px] font-bold text-[#1a365d] uppercase tracking-widest mb-3 block border-b border-[#1a365d] pb-1"
          />
          <EditableText
            value={personalInfo.summary}
            onChange={() => {}}
            multiline
            placeholder="Persönliche Zusammenfassung..."
            className="text-[10px] text-[#2d3748] leading-relaxed"
          />
        </section>
      )}

      {/* 工作经历 */}
      {experience.length > 0 && (
        <section className="mb-5">
          {showExperienceTitle && (
            <EditableLabel
              sectionType="experience"
              defaultLabel="BERUFSERFAHRUNG"
              className="text-[10px] font-bold text-[#1a365d] uppercase tracking-widest mb-3 block border-b border-[#1a365d] pb-1"
            />
          )}
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id} className="flex gap-3">
                <div className="w-20 flex-shrink-0 pt-0.5">
                  <EditableText
                    value={formatDate(exp.startDate, exp.endDate, exp.current)}
                    onChange={() => {}}
                    placeholder="Zeitraum"
                    className="text-[9px] text-[#a0aec0] leading-tight"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-[10px] font-semibold text-[#1a365d] mb-0.5">
                    <EditableText value={exp.position} onChange={() => {}} placeholder="Position" className="font-semibold text-[#1a365d]" />
                  </h3>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-[10px] text-[#2d3748]">
                      <EditableText value={exp.company} onChange={() => {}} placeholder="Unternehmen" className="text-[#2d3748]" />
                    </span>
                    {exp.location && (
                      <span className="text-[9px] text-[#a0aec0]">
                        · <EditableText value={exp.location} onChange={() => {}} placeholder="Ort" className="text-[#a0aec0]" />
                      </span>
                    )}
                  </div>
                  {exp.techStack && (
                    <div className="mb-1">
                      <EditableText value={exp.techStack} onChange={() => {}} placeholder="Technologien" className="text-[9px] text-[#a0aec0] italic" />
                    </div>
                  )}
                  <EditableText
                    value={exp.description}
                    onChange={() => {}}
                    multiline
                    placeholder="Beschreibung..."
                    className="text-[10px] text-[#4a5568] leading-relaxed whitespace-pre-line"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 项目经历 */}
      {projects.length > 0 && (
        <section className="mb-5">
          <EditableLabel
            sectionType="projects"
            defaultLabel="PROJEKTE"
            className="text-[10px] font-bold text-[#1a365d] uppercase tracking-widest mb-3 block border-b border-[#1a365d] pb-1"
          />
          <div className="space-y-3">
            {projects.map((proj) => (
              <div key={proj.id} className="flex gap-3">
                <div className="w-20 flex-shrink-0 pt-0.5">
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-[9px] text-[#a0aec0] leading-tight">
                      {proj.technologies.slice(0, 3).join(', ')}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-0.5">
                    <h3 className="text-[10px] font-semibold text-[#1a365d]">
                      <EditableText value={proj.name} onChange={() => {}} placeholder="Projektname" className="font-semibold text-[#1a365d]" />
                    </h3>
                    {proj.link && (
                      <EditableText value={proj.link} onChange={() => {}} placeholder="Link" className="text-[9px] text-[#a0aec0] ml-2 flex-shrink-0" />
                    )}
                  </div>
                  <EditableText
                    value={proj.description}
                    onChange={() => {}}
                    multiline
                    placeholder="Projektbeschreibung..."
                    className="text-[10px] text-[#4a5568] leading-relaxed"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 教育背景 */}
      {education.length > 0 && (
        <section className="mb-5">
          <EditableLabel
            sectionType="education"
            defaultLabel="AUSBILDUNG"
            className="text-[10px] font-bold text-[#1a365d] uppercase tracking-widest mb-3 block border-b border-[#1a365d] pb-1"
          />
          <div className="space-y-3">
            {education.map((edu) => (
              <div key={edu.id} className="flex gap-3">
                <div className="w-20 flex-shrink-0 pt-0.5">
                  <EditableText
                    value={formatDate(edu.startDate, edu.endDate, edu.current)}
                    onChange={() => {}}
                    placeholder="Zeitraum"
                    className="text-[9px] text-[#a0aec0] leading-tight"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="text-[10px] font-semibold text-[#1a365d] mb-0.5">
                    <EditableText value={edu.school} onChange={() => {}} placeholder="Schule / Universität" className="font-semibold text-[#1a365d]" />
                  </h3>
                  {(edu.degree || edu.field) && (
                    <p className="text-[10px] text-[#4a5568]">
                      <EditableText value={edu.degree} onChange={() => {}} placeholder="Abschluss" className="text-[#4a5568]" />
                      {edu.degree && edu.field && ' · '}
                      <EditableText value={edu.field} onChange={() => {}} placeholder="Fachrichtung" className="text-[#4a5568]" />
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

// ============ Page 1 ============
function Page1({ data }: { data: ResumeData }) {
  const { page1Experience } = splitContent(data);

  return (
    <div className="flex min-h-[1123px] bg-white p-8 font-sans" data-resume-preview>
      <LeftColumn data={data} />
      <RightColumn data={data} experience={page1Experience} showExperienceTitle={true} />
    </div>
  );
}

// ============ Page 2 ============
function Page2({ data }: { data: ResumeData }) {
  const { page2Experience } = splitContent(data);
  const page2HasMore = page2Experience.length > 0;
  const experience = page2HasMore ? page2Experience : [];

  return (
    <div className="min-h-[1123px] bg-white p-8 font-sans" data-resume-preview>
      {experience.length > 0 || data.education.length > 0 || data.projects.length > 0 ? (
        <div className="flex">
          <LeftColumn data={data} />
          <RightColumn data={data} experience={experience} showExperienceTitle={page2HasMore} />
        </div>
      ) : (
        <div className="flex">
          <LeftColumn data={data} />
          <RightColumn data={data} experience={[]} showExperienceTitle={false} />
        </div>
      )}
    </div>
  );
}

// ============ 主组件 ============
export function GermanTemplate() {
  const { resumeData } = useResumeEditing();

  return (
    <div className="flex flex-col gap-0">
      <div className="break-inside-avoid">
        <Page1 data={resumeData} />
      </div>
      <div className="break-inside-avoid">
        <Page2 data={resumeData} />
      </div>
    </div>
  );
}
