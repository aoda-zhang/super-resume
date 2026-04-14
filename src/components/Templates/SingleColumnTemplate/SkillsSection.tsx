/**
 * Single-column layout: skills section with optional category grouping.
 * - Skills WITH a category → displayed as a group with category header
 * - Skills WITHOUT a category → displayed individually (flat list, same as before)
 */
import { SkillEntry, SectionTitle } from "../shared/SectionRenderers";
import { singleColumnStyles as s } from "../shared/templateStyles";
import type { Skill } from "../../../types/resume";

interface SkillsSectionProps {
  skills: Skill[];
  tEditor: Record<string, string>;
  onUpdate: (id: string, data: Partial<Skill>) => void;
}

export function SkillsSection({ skills, tEditor, onUpdate }: SkillsSectionProps) {
  if (skills.length === 0) return null;

  // Separate: grouped (has category) vs flat (no category)
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

  return (
    <section className="mb-5">
      <SectionTitle
        label={tEditor.skills}
        sectionType="skills"
        className={s.label}
        style={s.sectionTitle}
      />

      {/* Skills WITH a category → group header + skills */}
      {groupedEntries.map(({ cat, skills: catSkills }) => (
        <div key={cat} className="mb-2 last:mb-0">
          <div className="text-slate-500 text-xs mb-1 uppercase tracking-wide" style={{ fontSize: '0.7rem' }}>
            {cat}
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-900" style={s.body}>
            {catSkills.map(skill => (
              <SkillEntry key={skill.id} skill={skill} onUpdate={onUpdate} />
            ))}
          </div>
        </div>
      ))}

      {/* Skills WITHOUT a category → flat list, no group header */}
      {ungrouped.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-slate-900" style={s.body}>
          {ungrouped.map(skill => (
            <SkillEntry key={skill.id} skill={skill} onUpdate={onUpdate} />
          ))}
        </div>
      )}
    </section>
  );
}
