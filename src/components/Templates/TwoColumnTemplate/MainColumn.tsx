
/**
 * Two-column layout: right main column container.
 * Assembles section components for the main content column.
 */
import { SummarySection } from "./SummarySection";
import { ExperienceSection } from "./ExperienceSection";
import { EducationSection } from "./EducationSection";
import { ProjectSection } from "./ProjectSection";
import type { Experience, Education, Project } from "../../../types/resume";

interface MainColumnProps {
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  t: Record<string, string>;
  tEditor: Record<string, string>;
  present: string;
  onUpdateSummary: (v: string) => void;
  onUpdateExperience: (id: string, data: Partial<Experience>) => void;
  onUpdateEducation: (id: string, data: Partial<Education>) => void;
  onUpdateProject: (id: string, data: Partial<Project>) => void;
}

export function MainColumn({
  summary,
  experience,
  education,
  projects,
  t,
  tEditor,
  present,
  onUpdateSummary,
  onUpdateExperience,
  onUpdateEducation,
  onUpdateProject,
}: MainColumnProps) {
  return (
    <div>
      <SummarySection
        value={summary}
        t={t}
        tEditor={tEditor}
        onUpdate={onUpdateSummary}
      />

      <ExperienceSection
        experience={experience}
        t={t}
        tEditor={tEditor}
        present={present}
        onUpdate={onUpdateExperience}
      />

      <EducationSection
        education={education}
        t={t}
        tEditor={tEditor}
        present={present}
        onUpdate={onUpdateEducation}
      />

      <ProjectSection
        projects={projects}
        t={t}
        tEditor={tEditor}
        onUpdate={onUpdateProject}
      />
    </div>
  );
}
