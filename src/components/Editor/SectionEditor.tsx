import { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import type { DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useResumeStore } from '../../store/resumeStore';
import { PersonalInfoSection } from '../Sections/PersonalInfoSection';
import { ExperienceSection } from '../Sections/ExperienceSection';
import { EducationSection } from '../Sections/EducationSection';
import { SkillsSection } from '../Sections/SkillsSection';
import { ProjectsSection } from '../Sections/ProjectsSection';
import { LanguagesSection } from '../Sections/LanguagesSection';
import { FileJson, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';

type SectionKey = 'personalInfo' | 'experience' | 'education' | 'skills' | 'projects' | 'languages';

interface Section {
  key: SectionKey;
  label: string;
  icon: string;
}

const defaultSections: Section[] = [
  { key: 'personalInfo', label: '个人信息', icon: '👤' },
  { key: 'experience', label: '工作经历', icon: '💼' },
  { key: 'education', label: '教育背景', icon: '🎓' },
  { key: 'skills', label: '技能', icon: '🛠️' },
  { key: 'projects', label: '项目', icon: '🚀' },
  { key: 'languages', label: '语言', icon: '🌐' },
];

// 可排序的章节项组件
function SortableSectionItem({
  section,
  isExpanded,
  onToggle,
  children,
}: {
  section: Section;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.key });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={isDragging ? 'relative z-50' : ''}>
      <div className="bg-white border-b border-slate-200">
        <div className="flex items-center">
          {/* 拖拽手柄 */}
          <div
            {...attributes}
            {...listeners}
            className="px-2 py-3 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 touch-none"
          >
            <GripVertical className="w-5 h-5" />
          </div>
          
          {/* 章节标题按钮 */}
          <button
            onClick={onToggle}
            className="flex-1 py-3 pr-4 flex items-center justify-between hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span>{section.icon}</span>
              <span className="font-medium text-slate-700">{section.label}</span>
            </div>
            {isExpanded ? (
              <ChevronDown className="w-5 h-5 text-slate-400" />
            ) : (
              <ChevronRight className="w-5 h-5 text-slate-400" />
            )}
          </button>
        </div>
        
        {/* 章节内容 */}
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-slate-100">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}

export function SectionEditor() {
  const { resumeData, updateResumeData } = useResumeStore();
  const [expandedSection, setExpandedSection] = useState<SectionKey>('personalInfo');
  const [showJson, setShowJson] = useState(false);
  const [sections, setSections] = useState<Section[]>(defaultSections);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 需要移动 8px 才开始拖拽，避免误触
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setSections((items) => {
        const oldIndex = items.findIndex((item) => item.key === active.id);
        const newIndex = items.findIndex((item) => item.key === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleUpdate = <K extends keyof typeof resumeData>(key: K, value: typeof resumeData[K]) => {
    updateResumeData({ [key]: value });
  };

  const renderSectionContent = (key: SectionKey) => {
    switch (key) {
      case 'personalInfo':
        return <PersonalInfoSection data={resumeData.personalInfo} onChange={(v) => handleUpdate('personalInfo', v)} />;
      case 'experience':
        return <ExperienceSection data={resumeData.experience} onChange={(v) => handleUpdate('experience', v)} />;
      case 'education':
        return <EducationSection data={resumeData.education} onChange={(v) => handleUpdate('education', v)} />;
      case 'skills':
        return <SkillsSection data={resumeData.skills} onChange={(v) => handleUpdate('skills', v)} />;
      case 'projects':
        return <ProjectsSection data={resumeData.projects} onChange={(v) => handleUpdate('projects', v)} />;
      case 'languages':
        return <LanguagesSection data={resumeData.languages} onChange={(v) => handleUpdate('languages', v)} />;
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-50">
      {/* 头部 */}
      <div className="px-4 py-3 bg-white border-b border-slate-200 flex items-center justify-between shrink-0">
        <h2 className="font-semibold text-slate-700">简历内容</h2>
        <button
          onClick={() => setShowJson(!showJson)}
          className={`flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg transition-colors ${
            showJson ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          <FileJson className="w-4 h-4" />
          JSON
        </button>
      </div>

      {/* JSON 视图 */}
      {showJson && (
        <div className="flex-1 overflow-auto p-4">
          <textarea
            value={JSON.stringify(resumeData, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                Object.keys(parsed).forEach(key => {
                  updateResumeData({ [key]: parsed[key] });
                });
              } catch {}
            }}
            className="w-full h-full min-h-[500px] p-4 font-mono text-xs bg-slate-900 text-green-400 rounded-lg border border-slate-700 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      )}

      {/* 章节列表（可拖拽） */}
      {!showJson && (
        <div className="flex-1 overflow-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sections.map(s => s.key)}
              strategy={verticalListSortingStrategy}
            >
              {sections.map((section) => (
                <SortableSectionItem
                  key={section.key}
                  section={section}
                  isExpanded={expandedSection === section.key}
                  onToggle={() => setExpandedSection(
                    expandedSection === section.key ? '' as SectionKey : section.key
                  )}
                >
                  {renderSectionContent(section.key)}
                </SortableSectionItem>
              ))}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}