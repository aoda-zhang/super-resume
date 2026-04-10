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

// 编辑器用的章节配置（含图标）
const sectionConfig: Record<SectionKey, { label: string; icon: string }> = {
  personalInfo: { label: '个人信息', icon: '👤' },
  experience: { label: '工作经历', icon: '💼' },
  education: { label: '教育背景', icon: '🎓' },
  skills: { label: '技能', icon: '🛠️' },
  projects: { label: '项目', icon: '🚀' },
  languages: { label: '语言', icon: '🌐' },
};

// store type 到 editor type 的映射
const storeToEditor: Record<string, SectionKey> = {
  personal: 'personalInfo',
  summary: 'personalInfo', // summary 合并到 personalInfo
  experience: 'experience',
  education: 'education',
  projects: 'projects',
  skills: 'skills',
  languages: 'languages',
};

// editor type 到 store type 的映射
const editorToStore: Record<SectionKey, string> = {
  personalInfo: 'personal',
  experience: 'experience',
  education: 'education',
  skills: 'skills',
  projects: 'projects',
  languages: 'languages',
};

// 可排序的章节项组件
function SortableSectionItem({
  sectionKey,
  label,
  icon,
  isExpanded,
  onToggle,
  children,
}: {
  sectionKey: SectionKey;
  label: string;
  icon: string;
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
  } = useSortable({ id: sectionKey });

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
              <span>{icon}</span>
              <span className="font-medium text-slate-700">{label}</span>
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
  const { resumeData, setResumeData, updateResumeData, sectionOrder, reorderSections } = useResumeStore();
  const [expandedSection, setExpandedSection] = useState<SectionKey>('personalInfo');
  const [showJson, setShowJson] = useState(false);
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState('');
  const [jsonDirty, setJsonDirty] = useState(false);

  // 打开 JSON 视图时，用 store 数据初始化
  const openJson = () => {
    setJsonText(JSON.stringify(resumeData, null, 2));
    setJsonError('');
    setJsonDirty(false);
    setShowJson(true);
  };

  // 关闭 JSON 视图时，如果有未应用的更改，提示
  const closeJson = () => {
    if (jsonDirty) {
      const ok = window.confirm('有未应用的 JSON 更改，确定关闭吗？');
      if (!ok) return;
    }
    setShowJson(false);
  };

  // 应用 JSON 到 store
  const applyJson = () => {
    try {
      const parsed = JSON.parse(jsonText);
      setResumeData(parsed);
      setJsonDirty(false);
      setJsonError('');
    } catch (e) {
      setJsonError(`JSON 格式错误: ${(e as Error).message}`);
    }
  };

  // 从 textarea 输入更新本地 state
  const handleJsonChange = (text: string) => {
    setJsonText(text);
    setJsonDirty(true);
    // 实时校验格式
    try {
      JSON.parse(text);
      setJsonError('');
    } catch (e) {
      setJsonError(`格式错误: ${(e as Error).message}`);
    }
  };

  // 从 store 的 sectionOrder 生成编辑器用的章节列表（过滤掉 summary，它合并到 personalInfo）
  const editorSections: SectionKey[] = sectionOrder
    .filter(s => s.visible && s.type !== 'summary')
    .map(s => storeToEditor[s.type] || 'personalInfo')
    .filter((key, i, arr) => arr.indexOf(key) === i); // 去重

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
      // 找到旧位置和新位置
      const oldIndex = editorSections.indexOf(active.id as SectionKey);
      const newIndex = editorSections.indexOf(over.id as SectionKey);
      
      // 重新排列 editorSections
      const newEditorOrder = arrayMove(editorSections, oldIndex, newIndex);
      
      // 构建新的 sectionOrder：保留 personal 和 summary 的原始对象
      const personalSection = sectionOrder.find(s => s.type === 'personal')!;
      const summarySection = sectionOrder.find(s => s.type === 'summary')!;
      
      const newSectionOrder: typeof sectionOrder = [];
      
      // 按新顺序添加章节
      for (const key of newEditorOrder) {
        if (key === 'personalInfo') {
          // personalInfo 对应 personal + summary
          newSectionOrder.push(personalSection);
          newSectionOrder.push(summarySection);
        } else {
          const storeType = editorToStore[key];
          const section = sectionOrder.find(s => s.type === storeType);
          if (section) newSectionOrder.push(section);
        }
      }
      
      console.log('handleDragEnd:', {
        oldIndex,
        newIndex,
        newEditorOrder,
        newSectionOrder: newSectionOrder.map(s => s.type)
      });
      
      reorderSections(newSectionOrder);
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
          onClick={showJson ? closeJson : openJson}
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
        <div className="flex-1 overflow-auto p-4 flex flex-col gap-3">
          {/* 工具栏 */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <button
                onClick={applyJson}
                disabled={!jsonDirty || !!jsonError}
                className={`px-4 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                  jsonDirty && !jsonError
                    ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                应用更改
              </button>
              <button
                onClick={openJson}
                className="px-3 py-1.5 text-sm rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              >
                重置
              </button>
            </div>
            <div className="flex items-center gap-2">
              {jsonDirty && !jsonError && (
                <span className="text-xs text-amber-600">有未应用的更改</span>
              )}
              {jsonError && (
                <span className="text-xs text-red-500 max-w-[200px] truncate" title={jsonError}>
                  ❌ {jsonError}
                </span>
              )}
              {!jsonError && jsonText && (
                <span className="text-xs text-green-600">✅ 格式正确</span>
              )}
            </div>
          </div>
          
          <textarea
            value={jsonText}
            onChange={(e) => handleJsonChange(e.target.value)}
            placeholder="粘贴你的 JSON 简历数据..."
            spellCheck={false}
            className="flex-1 w-full p-4 font-mono text-xs bg-slate-900 text-green-400 rounded-lg border border-slate-700 focus:ring-2 focus:ring-indigo-500 focus:outline-none resize-none"
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
              items={editorSections}
              strategy={verticalListSortingStrategy}
            >
              {editorSections.map((key) => {
                const config = sectionConfig[key];
                return (
                  <SortableSectionItem
                    key={key}
                    sectionKey={key}
                    label={config.label}
                    icon={config.icon}
                    isExpanded={expandedSection === key}
                    onToggle={() => setExpandedSection(
                      expandedSection === key ? '' as SectionKey : key
                    )}
                  >
                    {renderSectionContent(key)}
                  </SortableSectionItem>
                );
              })}
            </SortableContext>
          </DndContext>
        </div>
      )}
    </div>
  );
}