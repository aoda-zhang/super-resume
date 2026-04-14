/**
 * Two-column layout sidebar: skills list with optional category grouping.
 * Category name bold + comma-separated skill names.
 */
import { SectionTitle } from "../shared/SectionRenderers";
import { twoColumnStyles as s } from "../shared/templateStyles";
import type { Skill } from "../../../types/resume";

interface SkillsSectionProps {
  skills: Skill[];
  tEditor: Record<string, string>;
  onUpdate: (id: string, data: Partial<Skill>) => void;
}

export function SkillsSection({ skills, tEditor, onUpdate: _onUpdate }: SkillsSectionProps) {
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
    <div className="mt-4">
      <SectionTitle
        label={tEditor.skills}
        sectionType="skills"
        className={s.label}
        style={s.sectionTitle}
      />

      {groupedEntries.map(({ cat, skills: catSkills }) => {
        const names = catSkills.map(sk => sk.name).filter(Boolean).join(', ');
        return (
          <div key={cat} className="mb-2 last:mb-0">
            <div className="font-bold text-slate-600 mb-0.5 text-xs">{cat}</div>
            <div className="text-slate-800 text-xs" style={s.body}>{names}</div>
          </div>
        );
      })}

      {ungrouped.length > 0 && (
        <div className="text-slate-800 text-xs" style={s.body}>
          {ungrouped.map(sk => sk.name).filter(Boolean).join(', ')}
        </div>
      )}
    </div>
  );
}
