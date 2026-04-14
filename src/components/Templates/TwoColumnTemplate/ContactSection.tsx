
/**
 * Two-column layout sidebar: contact fields list.
 */
import { EditableText } from "../EditableComponents";

interface ContactSectionProps {
  personalInfo: {
    email?: string;
    phone?: string;
    address?: string;
    linkedin?: string;
    website?: string;
    github?: string;
    nationality?: string;
    birthDate?: string;
    workPermit?: string;
    blueCard?: string;
  };
  contactFields: string[];
  fieldLabels: Record<string, string>;
  onUpdateField: (field: string, value: string) => void;
}

export function ContactSection({
  personalInfo,
  contactFields,
  fieldLabels,
  onUpdateField,
}: ContactSectionProps) {
  return (
    <div className="space-y-0.5 text-slate-900" style={{ fontSize: "16px", fontWeight: "normal" }}>
      {contactFields.map((f) => (
        <div key={f} className="flex items-baseline gap-1 min-w-0">
          <span className="font-bold flex-shrink-0 whitespace-nowrap">{fieldLabels[f]}：</span>
          <EditableText
            value={(personalInfo[f as keyof typeof personalInfo] as string) || ""}
            onChange={(v) => onUpdateField(f, v)}
            placeholder={fieldLabels[f]}
            className="min-w-0 break-words"
          />
        </div>
      ))}
    </div>
  );
}
