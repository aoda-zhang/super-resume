import type { Skill } from '../../types/resume';
import { Plus, Trash2 } from 'lucide-react';
import { useResumeStore } from '../../store/resumeStore';
import { translations } from '../../i18n';

interface Props {
  data: Skill[];
  onChange: (data: Skill[]) => void;
}

/**
 * Skills editor: one row per group.
 * [ Category input | Skills input (comma-separated) | Delete ]
 * [ Category input | Skills input (comma-separated) | Delete ]
 * + Add Group
 */
export function SkillsSection({ data, onChange }: Props) {
  const language = useResumeStore((s) => s.language);
  const t = translations[language].form;
  const tEditor = translations[language].editor;
  const uncategorizedLabel = t.uncategorized || 'Other';

  // Build groups from data
  const groups: { id: string; cat: string; names: string[] }[] = [];
  const catMap: Record<string, number> = {};
  data.forEach(sk => {
    const cat = sk.category?.trim() || uncategorizedLabel;
    if (catMap[cat] === undefined) {
      catMap[cat] = groups.length;
      groups.push({ id: sk.id, cat, names: [] });
    }
    if (sk.name.trim()) groups[catMap[cat]].names.push(sk.name.trim());
  });

  // Update category name for all skills in a group
  const updateCategory = (groupId: string, oldCat: string, newCat: string) => {
    const safeNewCat = newCat.trim() || uncategorizedLabel;
    if (safeNewCat === oldCat) return;
    onChange(data.map(sk => {
      const skCat = sk.category?.trim() || uncategorizedLabel;
      return skCat === oldCat ? { ...sk, category: safeNewCat } : sk;
    }));
  };

  // Update skills (comma-separated text) for a group
  const updateSkills = (groupId: string, oldCat: string, text: string) => {
    const safeOldCat = oldCat.trim() || uncategorizedLabel;
    const safeNewCat = safeOldCat; // keep same category name
    const names = text.split(',').map(n => n.trim()).filter(Boolean);
    // Keep skills outside this group
    const outside = data.filter(sk => {
      const skCat = (sk.category?.trim() || uncategorizedLabel);
      return skCat !== safeOldCat;
    });
    // Rebuild skills for this group
    const rebuilt: Skill[] = names.map((name, i) => ({
      id: `skill_${Date.now()}_${groupId}_${i}`,
      name,
      level: 'intermediate' as const,
      category: safeOldCat === uncategorizedLabel ? '' : safeOldCat,
    }));
    onChange([...outside, ...rebuilt]);
  };

  // Delete an entire group
  const deleteGroup = (groupId: string) => {
    const group = groups.find(g => g.id === groupId);
    if (!group) return;
    onChange(data.filter(sk => {
      const skCat = (sk.category?.trim() || uncategorizedLabel);
      return skCat !== group.cat;
    }));
  };

  // Add a new empty group
  const addGroup = () => {
    const newSkill: Skill = {
      id: `skill_${Date.now()}`,
      name: '',
      level: 'intermediate',
      category: uncategorizedLabel,
    };
    onChange([...data, newSkill]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-slate-700">{tEditor.skills}</h3>
        <button
          onClick={addGroup}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4" />
          {t.addGroup || 'Add Group'}
        </button>
      </div>

      {groups.length === 0 ? (
        <div className="text-center py-6 text-slate-400">
          <p>{tEditor.add}</p>
          <button onClick={addGroup} className="mt-2 text-indigo-600 hover:text-indigo-700">
            + {t.addGroup || 'Add Group'}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          {groups.map((group) => (
            <div key={group.id} className="flex items-center gap-2">
              {/* Category input */}
              <input
                type="text"
                defaultValue={group.cat === uncategorizedLabel ? '' : group.cat}
                onBlur={(e) => updateCategory(group.id, group.cat, e.target.value)}
                placeholder={tEditor.skills || 'Category'}
                className="w-40 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 flex-shrink-0 font-medium text-slate-700"
              />
              {/* Skills comma-separated input */}
              <input
                type="text"
                defaultValue={group.names.join(', ')}
                onBlur={(e) => updateSkills(group.id, group.cat, e.target.value)}
                placeholder="e.g. JavaScript, TypeScript, React"
                className="flex-1 px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 text-slate-700"
              />
              {/* Delete button */}
              <button
                onClick={() => deleteGroup(group.id)}
                className="p-2 text-red-400 hover:text-red-600 flex-shrink-0"
                title="Delete group"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}