import { useResumeStore } from '../../store/resumeStore';
import { useEffect, useCallback } from 'react';

export function MarkdownEditor() {
  const { markdownContent, updateMarkdown, syncFromMarkdown } = useResumeStore();

  // 防抖同步
  useEffect(() => {
    const timer = setTimeout(() => {
      syncFromMarkdown();
    }, 500);
    return () => clearTimeout(timer);
  }, [markdownContent, syncFromMarkdown]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateMarkdown(e.target.value);
  }, [updateMarkdown]);

  return (
    <div className="h-full flex flex-col bg-slate-50">
      <div className="px-4 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Markdown Edit</h2>
          <span className="text-xs text-slate-500">实时预览中</span>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-auto">
        <textarea
          value={markdownContent}
          onChange={handleChange}
          className="w-full h-full min-h-[500px] p-4 font-mono text-sm bg-white border border-slate-200 rounded-lg resize-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          placeholder={`# Name

Email | Phone | Location

## Summary

简要Description你的职业背景和优势...

## Experience

### Title名称
**Company名称** | 2020-01 - Present

工作Description...

## Education

### Degree
**School名称** | Field | 2016-09 - 2020-06

## Skills

- **Skills名称**: 精通
- **Skills名称**: 熟练

## Projects经历

### Projects名称
ProjectsDescription...

Tech Stack: React, TypeScript

## Languages能力

- 中文: 母语
- 英语: 流利`}
          spellCheck={false}
        />
      </div>
      
      <div className="px-4 py-2 bg-slate-100 border-t border-slate-200 text-xs text-slate-500">
        支持标准 Markdown 语法，修改后会自动同步到右侧预览
      </div>
    </div>
  );
}
