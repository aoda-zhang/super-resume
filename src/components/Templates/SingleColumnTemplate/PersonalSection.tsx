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
      <div className="flex justify-between items-start">
        {/* Left: name + title + contacts */}
        <div className="flex-1 min-w-0">
          {personalInfo.fullName && (
            <h1 style={s.name} className="text-slate-900 mb-1 wrap-break-word">
              <EditableText
                value={personalInfo.fullName}
                onChange={(v) => onUpdateField("fullName", v)}
                placeholder={t.name}
              />
            </h1>
          )}
          {personalInfo.title && (
            <p style={s.title} className="text-sky-700 mb-3 wrap-break-word">
              <EditableText
                value={personalInfo.title}
                onChange={(v) => onUpdateField("title", v)}
                placeholder={t.title}
              />
            </p>
          )}

          {/* Contact fields — fixed 2 columns, content wraps inside each cell */}
          <div
            className="mt-2 grid gap-y-1 text-slate-900"
            style={{ ...s.body, gridTemplateColumns: "1fr 1fr" }}
          >
            {contactFields.map((f) => (
              <div key={f} className="flex items-baseline mr-10">
                <span className="font-bold shrink-0 whitespace-nowrap">
                  {fieldLabels[f]}：
                </span>
                <EditableText
                  value={(personalInfo[f as keyof typeof personalInfo] as string) || ""}
                  onChange={(v) => onUpdateField(f, v)}
                  placeholder={fieldLabels[f]}
                  className="min-w-0 wrap-break-word"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right: photo */}
        {personalInfo.photo && (
          <div className="shrink-0">
            <Photo
              src={personalInfo.photo}
              size={126}
              className="rounded-full border-2 border-slate-200"
            />
          </div>
        )}
      </div>
    </header>
  );
}
