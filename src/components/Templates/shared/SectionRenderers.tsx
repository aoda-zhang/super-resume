/**
 * Shared section renderers.
 * Every component accepts a `style` prop for template-specific typography/spacing.
 */
import { EditableText, EditableLabel } from "../EditableComponents";

// ---------------------------------------------------------------------------
// Utility: parses "YYYY-MM - YYYY-MM" or "YYYY-MM - Present" strings
// ---------------------------------------------------------------------------
export function parseDateRange(
  value: string,
  present: string,
  onSave: (dates: { startDate: string; endDate: string; current: boolean }) => void
) {
  const dashIdx = value.indexOf("-");
  const s1 = dashIdx >= 0 ? value.slice(0, dashIdx).trim() : value.trim();
  const s2 = dashIdx >= 0 ? value.slice(dashIdx + 1).trim() : "";
  onSave({
    startDate: s1,
    endDate: s2,
    current: s2.toLowerCase().includes(present.toLowerCase()),
  });
}

// ---------------------------------------------------------------------------
// Photo
// ---------------------------------------------------------------------------
export interface PhotoProps {
  src?: string;
  size?: number;
  className?: string;
}

export function Photo({ src, size = 96, className = "" }: PhotoProps) {
  if (!src) return null;
  return (
    <div
      className={`overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <img src={src} alt="Photo" className="w-full h-full object-cover" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Section title (e.g. "Experience", "Education")
// ---------------------------------------------------------------------------
export interface SectionTitleProps {
  label: string;
  sectionType: string;
  style?: React.CSSProperties;
  className?: string;
}

export function SectionTitle({
  label,
  sectionType,
  style,
  className = "",
}: SectionTitleProps) {
  return (
    <EditableLabel
      sectionType={sectionType}
      defaultLabel={label}
      className={`block mb-2 ${className}`}
      style={style}
    />
  );
}

// ---------------------------------------------------------------------------
// Summary section
// ---------------------------------------------------------------------------
export interface SummarySectionProps {
  value: string;
  placeholder: string;
  style?: React.CSSProperties;
}

export function SummarySection({
  value,
  placeholder,
  style,
}: SummarySectionProps) {
  return (
    <p className="leading-relaxed" style={style}>
      <EditableText
        value={value}
        onChange={() => {}}
        placeholder={placeholder}
        multiline
        className="w-full"
      />
    </p>
  );
}

// ---------------------------------------------------------------------------
// Experience entry
// ---------------------------------------------------------------------------
export interface ExperienceEntryProps {
  exp: {
    id: string;
    position: string;
    company: string;
    address?: string;
    country?: string;
    workMode?: string;
    startDate: string;
    endDate: string;
    current: boolean;
    techStack?: string;
    description: string;
  };
  t: Record<string, string>;
  present: string;
  onUpdate: (id: string, data: Partial<ExperienceEntryProps["exp"]>) => void;
  styles: {
    date?: React.CSSProperties;
    position?: React.CSSProperties;
    company?: React.CSSProperties;
    techStack?: React.CSSProperties;
    description?: React.CSSProperties;
  };
}

export function ExperienceEntry({
  exp,
  t,
  present,
  onUpdate,
  styles,
}: ExperienceEntryProps) {
  return (
    <div className="mb-3">
      <div className="flex justify-between items-baseline gap-2 mb-0.5">
        <h3 style={styles.position}>
          <EditableText
            value={exp.position}
            onChange={(v) => onUpdate(exp.id, { position: v })}
            placeholder={t.position || "Position"}
            className="font-bold text-slate-900"
          />
        </h3>
        <span style={styles.date} className="text-slate-500 flex-shrink-0">
          <EditableText
            value={`${exp.startDate}${exp.startDate ? " - " : ""}${exp.current ? present : exp.endDate}`}
            onChange={(v) => parseDateRange(v, present, (d) => onUpdate(exp.id, d))}
            placeholder={t.startDate || "Start - End"}
          />
        </span>
      </div>

      <div style={styles.company} className="text-slate-700">
        <EditableText
          value={exp.company}
          onChange={(v) => onUpdate(exp.id, { company: v })}
          placeholder={t.company || "Company"}
        />
        {exp.address && (
          <span>
            {" · "}
            <EditableText
              value={exp.address}
              onChange={(v) => onUpdate(exp.id, { address: v })}
              placeholder={t.address || "Address"}
            />
          </span>
        )}
        {exp.country && (
          <span>
            {" · "}
            <EditableText
              value={exp.country}
              onChange={(v) => onUpdate(exp.id, { country: v })}
              placeholder={t.nationality || "Country"}
            />
          </span>
        )}
        {exp.workMode && (
          <span>
            {" · "}
            <EditableText
              value={exp.workMode}
              onChange={(v) => onUpdate(exp.id, { workMode: v })}
              placeholder="Mode"
            />
          </span>
        )}
      </div>

      {exp.techStack && (
        <div style={styles.techStack} className="mt-0.5">
          <span className="text-slate-400 text-xs mr-1">Tech:</span>
          <div className="inline-flex flex-wrap gap-0.5">
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

      <p style={styles.description} className="mt-1.5 text-slate-900 whitespace-pre-line">
        <EditableText
          value={exp.description}
          onChange={(v) => onUpdate(exp.id, { description: v })}
          placeholder={t.description || "Description"}
          multiline
          className="w-full"
        />
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Education entry
// ---------------------------------------------------------------------------
export interface EducationEntryProps {
  edu: {
    id: string;
    school: string;
    field?: string;
    degree?: string;
    startDate: string;
    endDate: string;
    current: boolean;
    address?: string;
  };
  t: Record<string, string>;
  present: string;
  onUpdate: (id: string, data: Partial<EducationEntryProps["edu"]>) => void;
  styles: {
    date?: React.CSSProperties;
    school?: React.CSSProperties;
    field?: React.CSSProperties;
    address?: React.CSSProperties;
  };
}

export function EducationEntry({
  edu,
  t,
  present,
  onUpdate,
  styles,
}: EducationEntryProps) {
  return (
    <div className="mb-2">
      <div className="flex justify-between items-baseline gap-4">
        <span style={styles.date} className="text-slate-600 flex-shrink-0">
          <EditableText
            value={`${edu.startDate}${edu.startDate ? " - " : ""}${edu.current ? present : edu.endDate}`}
            onChange={(v) => parseDateRange(v, present, (d) => onUpdate(edu.id, d))}
            placeholder={t.startDate || "Start - End"}
          />
        </span>
        <span style={styles.field} className="text-slate-700 font-medium text-right flex-1">
          <EditableText
            value={edu.field || ""}
            onChange={(v) => onUpdate(edu.id, { field: v })}
            placeholder={t.major || "Field of Study"}
          />
        </span>
      </div>
      <div className="flex justify-between items-baseline gap-4">
        {edu.address && (
          <span style={styles.address} className="text-slate-500 flex-shrink-0">
            <EditableText
              value={edu.address}
              onChange={(v) => onUpdate(edu.id, { address: v })}
              placeholder={t.address || "Address"}
            />
          </span>
        )}
        <h3 style={styles.school} className="font-bold text-slate-900 text-right flex-1">
          <EditableText
            value={edu.school || ""}
            onChange={(v) => onUpdate(edu.id, { school: v })}
            placeholder={t.school || "School"}
            className="font-bold"
          />
        </h3>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Project entry
// ---------------------------------------------------------------------------
export interface ProjectEntryProps {
  proj: {
    id: string;
    name: string;
    description: string;
    technologies: string[];
  };
  t: Record<string, string>;
  onUpdate: (id: string, data: Partial<ProjectEntryProps["proj"]>) => void;
  styles: {
    name?: React.CSSProperties;
    description?: React.CSSProperties;
    tech?: React.CSSProperties;
  };
}

export function ProjectEntry({
  proj,
  t,
  onUpdate,
  styles,
}: ProjectEntryProps) {
  return (
    <div className="mb-2">
      <h3 style={styles.name} className="font-bold text-slate-900">
        <EditableText
          value={proj.name}
          onChange={(v) => onUpdate(proj.id, { name: v })}
          placeholder={t.projectName || "Project Name"}
          className="font-bold"
        />
      </h3>
      <p style={styles.description} className="mt-1 text-slate-900 whitespace-pre-line">
        <EditableText
          value={proj.description}
          onChange={(v) => onUpdate(proj.id, { description: v })}
          placeholder={t.description || "Description"}
          multiline
          className="w-full"
        />
      </p>
      {proj.technologies.length > 0 && (
        <div style={styles.tech} className="mt-1 text-slate-600">
          <span className="font-semibold">Tech: </span>
          {proj.technologies.map((tech, idx) => (
            <span key={idx}>
              <EditableText
                value={tech}
                onChange={(v) => {
                  const newTechs = [...proj.technologies];
                  newTechs[idx] = v;
                  onUpdate(proj.id, { technologies: newTechs });
                }}
                placeholder={t.skills || "Skills"}
              />
              {idx < proj.technologies.length - 1 && " · "}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Skill entry
// ---------------------------------------------------------------------------
export interface SkillEntryProps {
  skill: { id: string; name: string };
  onUpdate: (id: string, data: Partial<SkillEntryProps["skill"]>) => void;
  style?: React.CSSProperties;
}

export function SkillEntry({ skill, onUpdate, style }: SkillEntryProps) {
  return (
    <EditableText
      value={skill.name}
      onChange={(v) => onUpdate(skill.id, { name: v })}
      placeholder="Skill"
      style={style}
    />
  );
}

// ---------------------------------------------------------------------------
// Language entry
// ---------------------------------------------------------------------------
export interface LanguageEntryProps {
  lang: { id: string; name: string; level: string };
  onUpdate: (id: string, data: Partial<LanguageEntryProps["lang"]>) => void;
  nameStyle?: React.CSSProperties;
  levelStyle?: React.CSSProperties;
  separator?: string;
}

export function LanguageEntry({
  lang,
  onUpdate,
  nameStyle,
  levelStyle,
  separator = " - ",
}: LanguageEntryProps) {
  return (
    <div className="flex items-baseline gap-1">
      <EditableText
        value={lang.name}
        onChange={(v) => onUpdate(lang.id, { name: v })}
        placeholder="Language"
        className="font-medium text-slate-900"
        style={nameStyle}
      />
      <span className="text-slate-400">{separator}</span>
      <EditableText
        value={lang.level}
        onChange={(v) => onUpdate(lang.id, { level: v })}
        placeholder="Level"
        className="text-slate-500"
        style={levelStyle}
      />
    </div>
  );
}
