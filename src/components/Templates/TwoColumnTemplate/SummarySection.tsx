
/**
 * Two-column layout main column: summary section.
 */
import { EditableText } from "../EditableComponents";
import { SectionTitle } from "../shared/SectionRenderers";
import { twoColumnStyles as s } from "../shared/templateStyles";

interface SummarySectionProps {
  value: string;
  t: Record<string, string>;
  tEditor: Record<string, string>;
  onUpdate: (v: string) => void;
}

export function SummarySection({
  value,
  t,
  tEditor,
  onUpdate,
}: SummarySectionProps) {
  return (
    <section className="mb-4">
      <SectionTitle
        label={tEditor.summary}
        sectionType="summary"
        className={s.label}
        style={s.sectionTitle}
      />
      <p className="leading-relaxed text-slate-900" style={s.body}>
        <EditableText
          value={value || ""}
          onChange={onUpdate}
          placeholder={t.summaryPlaceholder}
          multiline
          className="w-full"
        />
      </p>
    </section>
  );
}
