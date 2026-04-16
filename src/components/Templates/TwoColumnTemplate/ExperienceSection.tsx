/**
 * Two-column layout main column: experience section.
 */
import { ExperienceEntry, SectionTitle } from "../shared/SectionRenderers";
import { twoColumnStyles as s } from "../shared/templateStyles";

interface Experience {
  id: string;
  position: string;
  company: string;
  companyWebsite?: string;
  companyDescription?: string;
  address?: string;
  country?: string;
  workMode?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  techStack?: string;
  description: string;
}

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
    <section className="mb-4">
      <SectionTitle
        label={tEditor.experience}
        sectionType="experience"
        className={s.label}
        style={s.sectionTitle}
      />
      {experience.map((exp) => (
        <div key={exp.id} className="grid mb-5" style={{ gridTemplateColumns: "150px 1fr", alignItems: "stretch" }}>
          {/* Left: time (fixed width) */}
          <div className="text-slate-900 pr-4 mr-4 h-full flex flex-col" style={{ fontSize: s.body.fontSize, alignSelf: "start" }}>
            <div className="whitespace-nowrap">{exp.startDate} – {exp.endDate || present}</div>
            {exp.address && <div className="mt-0.5">{exp.address}</div>}
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
