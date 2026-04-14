/**
 * Single-column layout: experience section.
 */
import { ExperienceEntry } from "../shared/SectionRenderers";
import { SectionTitle } from "../shared/SectionRenderers";
import { singleColumnStyles as s } from "../shared/templateStyles";
import type { Experience } from "../../../types/resume";

interface ExperienceSectionProps {
  experience: Experience[];
  t: Record<string, string>;
  tEditor: Record<string, string>;
  present: string;
  onUpdate: (id: string, data: Partial<Experience>) => void;
}

export function ExperienceSection({
  experience,
  t,
  tEditor,
  present,
  onUpdate,
}: ExperienceSectionProps) {
  if (experience.length === 0) return null;

  return (
    <section className="mb-5">
      <SectionTitle
        label={tEditor.experience}
        sectionType="experience"
        className={s.label}
        style={s.sectionTitle}
      />
      {experience.map((exp) => (
        <div key={exp.id} className="grid mb-3" style={{ gridTemplateColumns: "130px 1fr", alignItems: "start" }}>
          {/* Left: time (fixed width) */}
          <div className="text-slate-900 pr-4 mr-4 border-r border-slate-200" style={{ fontSize: s.body.fontSize }}>
            <div className="whitespace-nowrap">{exp.startDate} – {exp.endDate || present}</div>
            {exp.address && <div className="text-slate-500 mt-0.5">{exp.address}</div>}
          </div>

          {/* Right: content */}
          <div className="min-w-0">
            <ExperienceEntry
              exp={exp}
              t={t}
              present={present}
              onUpdate={onUpdate}
              styles={{ description: s.body }}
            />
          </div>
        </div>
      ))}
    </section>
  );
}
