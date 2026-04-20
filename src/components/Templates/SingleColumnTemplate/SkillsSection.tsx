/**
 * Single-column layout: skills section with optional category grouping.
 * - Skills WITH a category → category header (bold) + comma-separated skill names
 * - Skills WITHOUT a category → flat comma-separated list
 */
import { SectionTitle } from "../shared/SectionRenderers";
import { singleColumnStyles as s } from "../shared/templateStyles";
import type { Skill } from "../../../types/resume";

interface SkillsSectionProps {
  skills: Skill[];
  tEditor: Record<string, string>;
}

export function SkillsSection({ skills, tEditor }: SkillsSectionProps) {
  if (skills.length === 0) return null;

  const ungrouped = skills.filter(sk => !sk.category?.trim());
  const groupedEntries: Array<{ cat: string; skills: Skill[] }> = [];

  const seen = new Set<string>();
  skills.forEach(sk => {
    const cat = sk.category?.trim();
    if (cat && !seen.has(cat)) {
      seen.add(cat);
groupedEntries.push({
        cat,
        skills: skills.filter(s => s.category?.trim() === cat),
      });
    }
  });

// Sort by order field so drag-and-drop group reordering is reflected
  groupedEntries.sort((a, b) => {
    const aOrd = a.skills[0]?.order ?? 999;
    const bOrd = b.skills[0]?.order ?? 999;
    return aOrd - bOrd;
  });

  return (
    <section className="mb-4">
      <SectionTitle
        label={tEditor.skills}
        sectionType="skills"
        className={s.label}
        style={s.sectionTitle}
      />

      {/* Grouped skills: bold category + comma-separated names */}
      {groupedEntries.map(({ cat, skills: catSkills }) => {
        const names = catSkills.map(sk => sk.name).filter(Boolean).join(', ');
        return (
          <div key={cat} className="mb-1.5 last:mb-0 flex gap-2">
            <span className="font-bold text-slate-900 shrink-0">{cat}:</span>
            <span className="text-slate-900" style={s.body}>{names}</span>
          </div>
        );
      })}

      {/* Ungrouped skills */}
      {ungrouped.length > 0 && (
        <div className="text-slate-900" style={s.body}>
          {ungrouped.map(sk => sk.name).filter(Boolean).join(', ')}
        </div>
      )}
    </section>
  );
}
