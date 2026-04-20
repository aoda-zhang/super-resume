/**
 * Single-column layout: education section.
 * Uses a two-column grid with fixed-width time column (left) + content (right).
 */
import { SectionTitle } from "../shared/SectionRenderers";
import { singleColumnStyles as s } from "../shared/templateStyles";
import type { Education } from "../../../types/resume";

interface EducationSectionProps {
  education: Education[];
  t: Record<string, string>;
  tEditor: Record<string, string>;
  present: string;
  onUpdate: (id: string, data: Partial<Education>) => void;
}

export function EducationSection({
  education,
  t,
  tEditor,
  present,
}: EducationSectionProps) {
  if (education.length === 0) return null;

  return (
    <section className="mb-4">
      <SectionTitle
        label={tEditor.education}
        sectionType="education"
        className={s.label}
        style={s.sectionTitle}
      />
      {education.map((edu) => (
        <div
          key={edu.id}
          className="grid mb-2"
          style={{ gridTemplateColumns: "170px 1fr", alignItems: "stretch" }}
        >
          {/* Left: time (fixed width) */}
          <div
            className="text-slate-900 pr-4 mr-4 h-full flex flex-col"
            style={{ fontSize: s.body.fontSize, alignSelf: "start" }}
          >
            <div className="whitespace-nowrap">
              {edu.startDate} – {edu.current ? present : edu.endDate}
            </div>
          </div>

          {/* Right: field + school */}
          <div className="min-w-0">
            <div className="flex items-baseline gap-4">
              <span
                className="text-slate-900"
                style={{ fontSize: s.body.fontSize, alignSelf: "start" }}
              >
                {edu.field || t.major || "Field of Study"}
              </span>
              <span className="text-slate-500 shrink-0">
                {edu.degree ? `, ${edu.degree}` : ""}
              </span>
            </div>
            <div
              className="text-slate-900 mt-0.5"
              style={{ fontSize: s.body.fontSize, alignSelf: "start" }}
            >
              {edu.school || t.school || "School"}
            </div>
            {edu.address && (
              <div className="text-slate-900 mt-0.5">{edu.address}</div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
