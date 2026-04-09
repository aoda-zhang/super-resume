import { useState } from 'react';
import { useResumeStore } from '../../store/resumeStore';
import { ModernTemplate } from '../Templates/ModernTemplate';
import { ClassicTemplate } from '../Templates/ClassicTemplate';
import { MinimalTemplate } from '../Templates/MinimalTemplate';
import { GermanTemplate } from '../Templates/GermanTemplate';
import { MarkdownEditor } from './MarkdownEditor';
import { FileImage, FileText, GripVertical, Eye, EyeOff, Edit3, Layout } from 'lucide-react';
import { exportToPDF } from '../../utils/exportPdf';
import { exportToImage } from '../../utils/exportImage';

const templates = [
  { id: 'modern' as const, name: '现代', description: '简洁现代，适合科技和创意行业' },
  { id: 'classic' as const, name: '经典', description: '传统正式，适合金融和法律行业' },
  { id: 'minimal' as const, name: '极简', description: '极简设计，突出内容本身' },
  { id: 'german' as const, name: '德式', description: '符合德国简历格式规范' },
];

export function ResumeWorkspace() {
  const {
    editorMode,
    setEditorMode,
    template,
    setTemplate,
    sectionOrder,
    reorderSections,
    toggleSectionVisibility,
    updateSectionLabel,
  } = useResumeStore();

  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [editingLabel, setEditingLabel] = useState<string | null>(null);
  const [labelInput, setLabelInput] = useState('');

  const handleDragStart = (id: string) => {
    setDraggedItem(id);
  };

  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggedItem || draggedItem === targetId) return;

    const newOrder = [...sectionOrder];
    const draggedIdx = newOrder.findIndex(s => s.id === draggedItem);
    const targetIdx = newOrder.findIndex(s => s.id === targetId);

    if (draggedIdx !== -1 && targetIdx !== -1) {
      const [removed] = newOrder.splice(draggedIdx, 1);
      newOrder.splice(targetIdx, 0, removed);
      reorderSections(newOrder);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const startEditingLabel = (section: typeof sectionOrder[0]) => {
    setEditingLabel(section.id);
    setLabelInput(section.label);
  };

  const saveLabel = (sectionType: string) => {
    updateSectionLabel(sectionType, labelInput);
    setEditingLabel(null);
  };

  const handleExportPDF = async () => {
    const element = document.querySelector('[data-resume-preview]');
    if (element) {
      await exportToPDF(element as HTMLElement);
    }
  };

  const handleExportImage = async () => {
    const element = document.querySelector('[data-resume-preview]');
    if (element) {
      await exportToImage(element as HTMLElement);
    }
  };

  return (
    <div className="h-screen flex bg-slate-100">
      {/* 左侧面板 */}
      <div className="w-[420px] flex-shrink-0 h-full flex flex-col bg-white border-r border-slate-200">
        {/* 顶部工具栏 */}
        <div className="px-4 py-3 border-b border-slate-200">
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg">
            <button
              onClick={() => setEditorMode('markdown')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                editorMode === 'markdown'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              Markdown
            </button>
            <button
              onClick={() => setEditorMode('visual')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-all ${
                editorMode === 'visual'
                  ? 'bg-white text-indigo-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layout className="w-4 h-4" />
              可视化
            </button>
          </div>
        </div>

        {/* 编辑器内容 */}
        <div className="flex-1 overflow-hidden">
          {editorMode === 'markdown' ? (
            <MarkdownEditor />
          ) : (
            <div className="h-full flex flex-col">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-200">
                <h3 className="text-sm font-semibold text-slate-700 mb-3">区块排序与可见性</h3>
                <p className="text-xs text-slate-500 mb-3">拖拽调整顺序，点击标签可重命名</p>
              </div>
              <div className="flex-1 overflow-auto p-4">
                <div className="space-y-2">
                  {sectionOrder.map((section) => (
                    <div
                      key={section.id}
                      draggable
                      onDragStart={() => handleDragStart(section.id)}
                      onDragOver={(e) => handleDragOver(e, section.id)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center gap-2 p-3 bg-white border rounded-lg cursor-move transition-all ${
                        draggedItem === section.id
                          ? 'border-indigo-500 shadow-md'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <GripVertical className="w-4 h-4 text-slate-400" />
                      
                      {editingLabel === section.id ? (
                        <input
                          type="text"
                          value={labelInput}
                          onChange={(e) => setLabelInput(e.target.value)}
                          onBlur={() => saveLabel(section.type)}
                          onKeyDown={(e) => e.key === 'Enter' && saveLabel(section.type)}
                          className="flex-1 px-2 py-1 text-sm border border-indigo-500 rounded"
                          autoFocus
                        />
                      ) : (
                        <span
                          onClick={() => startEditingLabel(section)}
                          className="flex-1 text-sm font-medium text-slate-700 cursor-text hover:text-indigo-600"
                        >
                          {section.label}
                        </span>
                      )}
                      
                      <button
                        onClick={() => toggleSectionVisibility(section.type)}
                        className={`p-1.5 rounded transition-colors ${
                          section.visible
                            ? 'text-indigo-600 hover:bg-indigo-50'
                            : 'text-slate-400 hover:bg-slate-100'
                        }`}
                      >
                        {section.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 导出按钮 */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportPDF}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <FileText className="w-4 h-4" />
              导出 PDF
            </button>
            <button
              onClick={handleExportImage}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              <FileImage className="w-4 h-4" />
              导出图片
            </button>
          </div>
        </div>
      </div>

      {/* 右侧面板 - 预览 */}
      <div className="flex-1 h-full flex flex-col">
        {/* 模板选择器 */}
        <div className="px-6 py-3 bg-white border-b border-slate-200">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-slate-700">模板:</span>
            <div className="flex gap-2">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTemplate(t.id)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
                    template === t.id
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                  title={t.description}
                >
                  {t.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 预览区域 */}
        <div className="flex-1 overflow-auto p-8 bg-slate-200">
          <div className="mx-auto" style={{ width: '210mm' }} data-resume-preview>
            {template === 'modern' && <ModernTemplate />}
            {template === 'classic' && <ClassicTemplate />}
            {template === 'minimal' && <MinimalTemplate />}
            {template === 'german' && <GermanTemplate />}
          </div>
        </div>
      </div>
    </div>
  );
}
