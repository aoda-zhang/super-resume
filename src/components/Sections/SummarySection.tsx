import { useResumeStore } from '../../store/resumeStore';
import { translations } from '../../i18n';

interface Props {
  data: string;
  onChange: (data: string) => void;
}

export function SummarySection({ data, onChange }: Props) {
  const language = useResumeStore((s) => s.language);
  const tEditor = translations[language].editor;

  return (
    <div className="space-y-3">
      {/* Summary text area */}
      <div>
        <textarea
          value={data}
          onChange={(e) => onChange(e.target.value)}
          placeholder={tEditor.summary || 'Professional summary...'}
          rows={5}
          className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg
                     focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                     resize-y min-h-[120px]"
        />
      </div>
    </div>
  );
}
