
/**
 * Two-column layout sidebar: photo + name + title.
 */
import { EditableText } from "../EditableComponents";
import { Photo } from "../shared/SectionRenderers";
import { twoColumnStyles as s } from "../shared/templateStyles";

interface PersonalSectionProps {
  photo?: string;
  fullName: string;
  title: string;
  t: Record<string, string>;
  onUpdateField: (field: string, value: string) => void;
}

export function PersonalSection({
  photo,
  fullName,
  title,
  t,
  onUpdateField,
}: PersonalSectionProps) {
  return (
    <>
      {/* Photo */}
      {photo && (
        <div className="mb-4 flex justify-center">
          <Photo
            src={photo}
            size={s.photoSize}
            className="rounded-full border-4 border-slate-300"
          />
        </div>
      )}

      {/* Name */}
      {fullName && (
        <h1 style={s.name} className="text-slate-900 mb-1">
          <EditableText
            value={fullName}
            onChange={(v) => onUpdateField("fullName", v)}
            placeholder={t.name}
          />
        </h1>
      )}

      {/* Title */}
      {title && (
        <p style={s.title} className="text-slate-900 mb-3">
          <EditableText
            value={title}
            onChange={(v) => onUpdateField("title", v)}
            placeholder={t.title}
          />
        </p>
      )}
    </>
  );
}
