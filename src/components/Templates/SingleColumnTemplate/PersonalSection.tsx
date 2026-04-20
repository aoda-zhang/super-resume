/**
 * Single-column layout: personal info header.
 */
import { EditableText } from "../EditableComponents";
import { Photo } from "../shared/SectionRenderers";
import { singleColumnStyles as s } from "../shared/templateStyles";
import type { PersonalInfo } from "../../../types/resume";

interface PersonalSectionProps {
  personalInfo: PersonalInfo;
  contactFields: string[];
  fieldLabels: Record<string, string>;
  t: Record<string, string>;
  onUpdateField: (field: string, value: string) => void;
}

export function PersonalSection({
  personalInfo,
  contactFields,
  fieldLabels,
  t,
  onUpdateField,
}: PersonalSectionProps) {
  return (
    <header className="mb-6">
      {/* Top: Name and Title */}
      <div className="mb-4">
        {personalInfo.fullName && (
          <h1 style={s.name} className="text-slate-900">
            <EditableText
              value={personalInfo.fullName}
              onChange={(v) => onUpdateField("fullName", v)}
              placeholder={t.name}
            />
          </h1>
        )}
        {personalInfo.title && (
          <p style={s.title} className="text-sky-700 wrap-break-word">
            <EditableText
              value={personalInfo.title}
              onChange={(v) => onUpdateField("title", v)}
              placeholder={t.title}
            />
          </p>
        )}
      </div>

      {/* Bottom: Contact info left, Avatar right */}
      <div className="flex justify-between items-center gap-6">
        {/* Contact fields at bottom left */}
        <div className="text-slate-900">
          {contactFields.map((f) => (
            <div key={f} className="flex items-baseline">
              <span className="font-bold shrink-0 whitespace-nowrap pr-1">
                {fieldLabels[f]}
                <span>:</span>
              </span>
              <EditableText
                value={
                  (personalInfo[f as keyof typeof personalInfo] as string) || ""
                }
                onChange={(v) => onUpdateField(f, v)}
                placeholder={fieldLabels[f]}
                className="min-w-0 wrap-break-word"
              />
            </div>
          ))}
        </div>

        {/* Avatar at bottom right */}
        {personalInfo.photo && (
          <div className="shrink-0">
            <Photo
              src={personalInfo.photo}
              size={200}
              className="rounded-full border-2 border-slate-200"
            />
          </div>
        )}
      </div>
    </header>
  );
}
