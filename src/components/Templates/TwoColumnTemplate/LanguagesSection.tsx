
/**
 * Two-column layout sidebar: languages list.
 */
import { SectionTitle, LanguageEntry } from "../shared/SectionRenderers";
import { twoColumnStyles as s } from "../shared/templateStyles";

interface Language {
  id: string;
  name: string;
  level: string;
}

interface LanguagesSectionProps {
  languages: Language[];
  tEditor: Record<string, string>;
  onUpdate: (id: string, data: Partial<Language>) => void;
}

export function LanguagesSection({ languages, tEditor, onUpdate }: LanguagesSectionProps) {
  if (languages.length === 0) return null;

  return (
    <div className="mt-4">
      <SectionTitle
        label={tEditor.languages}
        sectionType="languages"
        className={s.label}
        style={s.sectionTitle}
      />
      <div className="space-y-0.5 text-slate-900" style={s.body}>
        {languages.map((lang) => (
          <LanguageEntry key={lang.id} lang={lang} onUpdate={onUpdate} />
        ))}
      </div>
    </div>
  );
}
